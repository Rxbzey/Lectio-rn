import { Animated, Dimensions, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChapterIntro } from './ChapterIntro';
import { VerseBlock } from './VerseBlock';
import { getChapter, type ChapterResponse } from '../../lib/api';
import { saveReadingProgress } from '../../lib/readingProgress';
import { FloatingActionButton } from '../LectioVeritatis/FloatingActionButton';

interface ChapterReaderProps {
  isDark: boolean;
  bookSlug: string;
  chapter: number;
  appBarHeight?: number;
  initialScrollPercent?: number;
  onProgressChange?: (progress: { bookSlug: string; bookName: string; chapter: number; scrollPercent: number; verseCount?: number }) => void;
  onHome?: () => void;
  onBooks?: () => void;
  onChapters?: () => void;
  onVerses?: () => void;
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
  onProgressChange,
  onHome,
  onBooks,
  onChapters,
  onVerses,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<any>(null);
  const [chapterData, setChapterData] = useState<ChapterResponse | null>(null);
  const [error, setError] = useState(false);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const onProgressChangeRef = useRef(onProgressChange);
  const insets = useSafeAreaInsets();

  useEffect(() => { onProgressChangeRef.current = onProgressChange; }, [onProgressChange]);
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
              chapter={chapter}
              testamentLabel={testamentLabel}
            />
          ))}
        </Animated.View>
      </Animated.ScrollView>

      <ChapterIntro isDark={isDark} scrollY={scrollY} bookName={bookName || 'Cargando'} chapter={chapter} testamentLabel={testamentLabel || 'Biblia'} />
      <FloatingActionButton
        isDark={isDark}
        isReader
        onHome={onHome}
        onBooks={onBooks}
        onChapters={onChapters}
        onVerses={onVerses}
      />
    </View>
  );
};
