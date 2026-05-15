import { Animated, Dimensions, Share, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as ExpoSharing from 'expo-sharing';
import {
  readVerseMarks,
  saveVerseMark,
  deleteVerseMark,
  readColorConfig,
  makeMarkId,
  getMarkForVerse,
  DEFAULT_COLOR_NAMES,
  type MarkColor,
  type VerseMarksStore,
} from '../../lib/verseMarks';
import ViewShot from 'react-native-view-shot';
import { ChapterIntro } from './ChapterIntro';
import { VerseBlock } from './VerseBlock';
import { ShareImageTemplate } from './ShareImageTemplate';
import { VerseSelectionToolbar } from './VerseSelectionToolbar';
import { getChapter, type ChapterResponse } from '../../lib/api';
import { saveReadingProgress } from '../../lib/readingProgress';
import { FloatingActionButton } from '../LectioVeritatis/FloatingActionButton';

interface ChapterReaderProps {
  isDark: boolean;
  bookSlug: string;
  chapter: number;
  appBarHeight?: number;
  initialScrollPercent?: number;
  targetVerse?: number;
  onProgressChange?: (progress: { bookSlug: string; bookName: string; chapter: number; scrollPercent: number; verseCount?: number }) => void;
  onHome?: () => void;
  onBooks?: () => void;
  onMarks?: () => void;
  onChapters?: () => void;
  onVerses?: () => void;
  marksRefreshKey?: number;
}

const { height: screenHeight } = Dimensions.get('window');

function chunkVerses<T>(verses: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < verses.length; index += size) {
    chunks.push(verses.slice(index, index + size));
  }
  return chunks;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  isDark,
  bookSlug,
  chapter,
  appBarHeight,
  initialScrollPercent,
  targetVerse,
  onProgressChange,
  onHome,
  onBooks,
  onMarks,
  onChapters,
  onVerses,
  marksRefreshKey,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<any>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const [chapterData, setChapterData] = useState<ChapterResponse | null>(null);
  const [error, setError] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());
  const [verseMarks, setVerseMarks] = useState<VerseMarksStore>([]);
  const [colorNames, setColorNames] = useState<Record<MarkColor, string>>(DEFAULT_COLOR_NAMES);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const onProgressChangeRef = useRef(onProgressChange);
  const scrolledToVerseRef = useRef(false);
  const insets = useSafeAreaInsets();

  useEffect(() => { onProgressChangeRef.current = onProgressChange; }, [onProgressChange]);

  useEffect(() => {
    readVerseMarks().then(setVerseMarks);
    readColorConfig().then(setColorNames);
  }, [marksRefreshKey]);
  const backgroundColor = isDark ? '#000000' : '#efe6d4';
  const bookName = chapterData?.book.name ?? '';
  const testamentLabel = chapterData?.book.group ?? '';
  const verseChunks = chunkVerses(chapterData?.verses ?? [], 7);

  useEffect(() => {
    let active = true;
    setChapterData(null);
    setError(false);
    getChapter(bookSlug, chapter)
      .then((data) => {
        if (!active) return;
        setChapterData(data);
        const progress = { bookSlug, bookName: data.book.name, chapter, scrollPercent: initialScrollPercent ?? 0, verseCount: data.verses.length };
        onProgressChangeRef.current?.(progress);
        void saveReadingProgress({ ...progress, updatedAt: Date.now() });
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [bookSlug, chapter, initialScrollPercent]);

  useEffect(() => {
    if (!chapterData || !initialScrollPercent) return;
    requestAnimationFrame(() => {
      const maxScroll = Math.max(0, contentHeightRef.current - viewportHeightRef.current);
      scrollRef.current?.scrollTo?.({ y: maxScroll * initialScrollPercent, animated: false });
    });
  }, [chapterData, initialScrollPercent]);

  useEffect(() => {
    scrolledToVerseRef.current = false;
  }, [bookSlug, chapter, targetVerse]);

  const handleVerseRef = (verseNumber: number, ref: any) => {
    if (!ref || !targetVerse || verseNumber !== targetVerse || scrolledToVerseRef.current) return;
    scrolledToVerseRef.current = true;
    setTimeout(() => {
      ref.measureInWindow((_x: number, screenY: number) => {
        const currentScrollY = (scrollY as any).__getValue?.() ?? 0;
        const absoluteY = currentScrollY + screenY - (appBarHeight ?? insets.top + 60) - 24;
        scrollRef.current?.scrollTo?.({ y: absoluteY, animated: true });
      });
    }, 200);
  };

  const hasMarkedVerses = selectedVerses.size > 0 &&
    Array.from(selectedVerses).some((v) => getMarkForVerse(verseMarks, bookSlug, chapter, v) !== undefined);

  const handleUnmark = async () => {
    const toDelete = Array.from(selectedVerses)
      .map((v) => getMarkForVerse(verseMarks, bookSlug, chapter, v))
      .filter((m): m is NonNullable<typeof m> => m !== undefined);
    const seen = new Set<string>();
    let updated = verseMarks;
    for (const mark of toDelete) {
      if (!seen.has(mark.id)) {
        seen.add(mark.id);
        updated = await deleteVerseMark(mark.id);
      }
    }
    setVerseMarks(updated);
    setSelectedVerses(new Set());
  };

  const handleMark = async (color: MarkColor) => {
    if (!chapterData || selectedVerses.size === 0) return;
    const sorted = Array.from(selectedVerses).sort((a, b) => a - b);
    const verseStart = sorted[0];
    const verseEnd = sorted[sorted.length - 1];
    const verseTexts = chapterData.verses
      .filter((v) => selectedVerses.has(v.number))
      .map((v) => ({ number: v.number, text: v.text }));
    const mark = {
      id: makeMarkId(bookSlug, chapter, verseStart, verseEnd),
      bookSlug,
      bookName: chapterData.book.name,
      chapter,
      verseStart,
      verseEnd,
      verseTexts,
      color,
      createdAt: Date.now(),
    };
    const updated = await saveVerseMark(mark);
    setVerseMarks(updated);
    setSelectedVerses(new Set());
  };

  const handleVerseLongPress = (verseNumber: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNumber)) { next.delete(verseNumber); } else { next.add(verseNumber); }
      return next;
    });
  };

  const handleVersePress = (verseNumber: number) => {
    setSelectedVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNumber)) { next.delete(verseNumber); } else { next.add(verseNumber); }
      return next;
    });
  };

  const getSelectedVersesData = () => {
    if (!chapterData) return [];
    return chapterData.verses
      .filter((v) => selectedVerses.has(v.number))
      .sort((a, b) => a.number - b.number);
  };

  const handleCopy = async () => {
    const verses = getSelectedVersesData();
    const bookName = chapterData?.book.name ?? '';
    const text = verses.map((v) => `${v.number} ${v.text}`).join(' ');
    const ref = verses.length > 0 ? `${bookName} ${chapter}:${verses[0].number}${verses.length > 1 ? `–${verses[verses.length - 1].number}` : ''}` : '';
    await Clipboard.setStringAsync(`${text}\n\n— ${ref}`);
    setSelectedVerses(new Set());
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;
      if (await ExpoSharing.isAvailableAsync()) {
        await ExpoSharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Compartir versículo' });
      } else {
        await Share.share({ url: uri });
      }
    } catch {}
    setSelectedVerses(new Set());
  };

  const persistProgress = (scrollPercent: number) => {
    if (!chapterData) return;
    const progress = { bookSlug, bookName: chapterData.book.name, chapter, scrollPercent, verseCount: chapterData.verses.length };
    onProgressChange?.(progress);
    void saveReadingProgress({ ...progress, updatedAt: Date.now() });
  };

  const contentOpacity = scrollY.interpolate({
    inputRange: [260, 460],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const contentTranslateY = scrollY.interpolate({
    inputRange: [260, 520],
    outputRange: [44, 0],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <Animated.ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingTop: screenHeight + (appBarHeight || insets.top + 60), paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onLayout={(event) => {
          viewportHeightRef.current = event.nativeEvent.layout.height;
        }}
        onContentSizeChange={(_, height) => {
          contentHeightRef.current = height;
        }}
        onMomentumScrollEnd={(event) => {
          const maxScroll = Math.max(1, contentHeightRef.current - viewportHeightRef.current);
          persistProgress(Math.min(1, Math.max(0, event.nativeEvent.contentOffset.y / maxScroll)));
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      >
        <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}>
          {!chapterData && !error ? (
            <Text className="px-6 text-center text-gold" style={{ fontFamily: 'Inter' }}>Cargando capítulo...</Text>
          ) : null}
          {error ? (
            <Text className="px-6 text-center text-gold" style={{ fontFamily: 'Inter' }}>No se pudo cargar este capítulo.</Text>
          ) : null}
          {verseChunks.map((verses) => (
            <VerseBlock
              key={`${verses[0].number}-${verses[verses.length - 1].number}`}
              verses={verses}
              isDark={isDark}
              bookName={bookName}
              bookSlug={bookSlug}
              chapter={chapter}
              testamentLabel={testamentLabel}
              highlightVerse={selectedVerses.size === 0 ? targetVerse : undefined}
              selectedVerses={selectedVerses}
              verseMarks={verseMarks}
              onVerseRef={handleVerseRef}
              onVerseLongPress={handleVerseLongPress}
              onVersePress={handleVersePress}
            />
          ))}
        </Animated.View>
      </Animated.ScrollView>

      <ChapterIntro isDark={isDark} scrollY={scrollY} bookName={bookName || 'Cargando'} chapter={chapter} testamentLabel={testamentLabel || 'Biblia'} />

      {/* Hidden share image capture */}
      {selectedVerses.size > 0 && chapterData && (() => {
        const verses = getSelectedVersesData();
        const rangeStart = verses[0]?.number ?? 1;
        const rangeEnd = verses[verses.length - 1]?.number ?? 1;
        return (
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1 }}
            style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0 }}
          >
            <ShareImageTemplate
              isDark={isDark}
              bookName={chapterData.book.name}
              chapter={chapter}
              verses={verses}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
            />
          </ViewShot>
        );
      })()}

      {selectedVerses.size > 0 && (
        <VerseSelectionToolbar
          isDark={isDark}
          selectedCount={selectedVerses.size}
          colorNames={colorNames}
          hasMarkedVerses={hasMarkedVerses}
          onCopy={handleCopy}
          onShare={handleShare}
          onMark={handleMark}
          onUnmark={handleUnmark}
          onClear={() => setSelectedVerses(new Set())}
        />
      )}

      {selectedVerses.size === 0 && (
        <FloatingActionButton
          isDark={isDark}
          isReader
          onHome={onHome}
          onBooks={onBooks}
          onMarks={onMarks}
          onChapters={onChapters}
          onVerses={onVerses}
        />
      )}
    </View>
  );
};
