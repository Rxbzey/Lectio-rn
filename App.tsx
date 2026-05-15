import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { AppBar } from 'components/AppBar';
import { BooksIndex } from 'components/BooksIndex';
import { ChapterReader } from 'components/ChapterReader';
import { LectioVeritatis } from 'components/LectioVeritatis';
import { SearchScreen } from 'components/SearchScreen';
import { NumberGridScreen } from 'components/NumberGridScreen';
import { MarksScreen } from 'components/MarksScreen';
import { SplashScreen } from 'components/SplashScreen';
import { BOOKS_META, slugifyBookName } from './data/biblia/books-meta';
import { Animated, Easing, Platform, useColorScheme } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { useAppStore } from './lib/stores/useAppStore';
import { useThemeStore } from './lib/stores/useThemeStore';
import { useProgressStore } from './lib/stores/useProgressStore';
import { getRandomVerse } from './data/bibleVerses';

import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#c9a84c',
    secondary: '#d4cfc5',
    surface: '#080808',
    onSurface: '#ece7db',
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  type Screen = 'home' | 'books' | 'chapters' | 'verses' | 'reader' | 'search' | 'marks';
  const { screen, navigateTo, jumpTo, goBack } = useAppStore();
  const { isDark, toggleTheme, initializeTheme } = useThemeStore();
  const { readingProgress, bookProgressMap, initializeProgress, updateReadingProgress, markChapterAsRead } = useProgressStore();
  const [marksRefreshKey, setMarksRefreshKey] = useState(0);
  const [currentBookSlug, setCurrentBookSlug] = useState('genesis');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedBookSlug, setSelectedBookSlug] = useState('genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [initialScrollPercent, setInitialScrollPercent] = useState(0);
  const [targetVerse, setTargetVerse] = useState<number | undefined>(undefined);
  const [verseOfDay, setVerseOfDay] = useState<{ text: string; reference: string } | null>(null);
  const [appBarHeight, setAppBarHeight] = useState(0);
  const [currentVerseCount, setCurrentVerseCount] = useState(0);
  const homeProgress = useRef(new Animated.Value(1)).current;
  const booksProgress = useRef(new Animated.Value(0)).current;
  const chaptersProgress = useRef(new Animated.Value(0)).current;
  const versesProgress = useRef(new Animated.Value(0)).current;
  const readerProgress = useRef(new Animated.Value(0)).current;
  const searchProgress = useRef(new Animated.Value(0)).current;
  const marksProgress = useRef(new Animated.Value(0)).current;

  const getBookMeta = (slug: string) => BOOKS_META.find((b) => slugifyBookName(b.name) === slug);
  const selectedBookMeta = getBookMeta(selectedBookSlug);
  const chapterCount = selectedBookMeta?.chapters ?? 0;

  const progressMap: Record<Screen, Animated.Value> = {
    home: homeProgress,
    books: booksProgress,
    chapters: chaptersProgress,
    verses: versesProgress,
    reader: readerProgress,
    search: searchProgress,
    marks: marksProgress,
  };

  const animateTransition = (from: Screen, to: Screen) => {
    const duration = isDark ? 620 : 500;
    const easing = isDark ? Easing.out(Easing.cubic) : Easing.bezier(0.22, 1, 0.36, 1);
    Animated.parallel([
      Animated.timing(progressMap[from], { toValue: 0, duration, easing, useNativeDriver: true }),
      Animated.timing(progressMap[to], { toValue: 1, duration: to === 'reader' ? duration + 120 : duration, easing, useNativeDriver: true }),
    ]).start();
  };

  const handleNavigateTo = (nextScreen: Screen) => {
    const from = screen;
    navigateTo(nextScreen);
    animateTransition(from, nextScreen);
  };

  const handleJumpTo = (target: Screen) => {
    const from = screen;
    jumpTo(target);
    animateTransition(from, target);
  };

  const handleGoBack = () => {
    const from = screen;
    goBack();
    const prev = useAppStore.getState().screen;
    animateTransition(from, prev);
  };
  const [fontsLoaded] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Light': Inter_300Light,
    'PlayfairDisplay': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('light');
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  useEffect(() => {
    Promise.all([
      initializeTheme(colorScheme === 'dark'),
      initializeProgress(),
    ]).catch(console.error);
  }, [colorScheme, initializeTheme, initializeProgress]);

  useEffect(() => {
    let active = true;
    getRandomVerse()
      .then((verse) => {
        if (!active) return;
        setVerseOfDay(verse);
      })
      .catch(() => {
        if (active) setVerseOfDay(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const openReader = (bookSlug: string, chapter: number, scrollPercent = 0, verse?: number) => {
    setCurrentBookSlug(bookSlug);
    setCurrentChapter(chapter);
    setInitialScrollPercent(verse ? 0 : scrollPercent);
    setTargetVerse(verse);
    if (screen === 'reader') return;
    handleNavigateTo('reader');
  };
  const openChapters = (bookSlug: string) => {
    setSelectedBookSlug(bookSlug);
    handleNavigateTo('chapters');
  };
  const openVerses = (chapter: number) => {
    setSelectedChapter(chapter);
    handleNavigateTo('verses');
  };
  const handleStartReading = () => {
    if (readingProgress) {
      openReader(readingProgress.bookSlug, readingProgress.chapter, readingProgress.scrollPercent);
      return;
    }
    openReader('genesis', 1, 0);
  };
  const progressLabel = readingProgress ? `${readingProgress.bookName} · Capítulo ${readingProgress.chapter}` : undefined;
  const backgroundColor = isDark ? '#050505' : '#efe6d4';
  const homeExitY = isDark ? -18 : -30;
  const booksEnterY = isDark ? 22 : 36;
  const hiddenScale = isDark ? 0.992 : 0.984;

  if (!fontsLoaded) {
    return <SplashScreen isDark={isDark} />;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider style={{ backgroundColor }}>
        <Animated.View
          pointerEvents={screen === 'home' ? 'auto' : 'none'}
          className="absolute inset-0"
          style={{
            opacity: homeProgress,
            transform: [
              {
                translateY: homeProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [homeExitY, 0],
                }),
              },
              {
                scale: homeProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hiddenScale, 1],
                }),
              },
            ],
          }}
        >
          <LectioVeritatis
            isDark={isDark}
            hasProgress={Boolean(readingProgress)}
            progressLabel={progressLabel}
            verseOfDay={verseOfDay}
            onStartReading={handleStartReading}
            onExploreBooks={() => handleNavigateTo('books')}
            onHome={() => handleJumpTo('home')}
            onSearch={() => handleJumpTo('search')}
            onMarks={() => handleNavigateTo('marks')}
          />
        </Animated.View>

        <Animated.View
          pointerEvents={screen === 'books' ? 'auto' : 'none'}
          className="absolute inset-0"
          style={{
            opacity: booksProgress,
            transform: [
              {
                translateY: booksProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [booksEnterY, 0],
                }),
              },
              {
                scale: booksProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hiddenScale, 1],
                }),
              },
            ],
          }}
        >
          <BooksIndex
            isDark={isDark}
            activeBookSlug={currentBookSlug}
            appBarHeight={appBarHeight}
            bookProgressMap={bookProgressMap}
            onClose={handleGoBack}
            onBookPress={(bookSlug) => openChapters(bookSlug)}
            onHome={() => handleJumpTo('home')}
            onSearch={() => handleJumpTo('search')}
            onMarks={() => handleNavigateTo('marks')}
          />
        </Animated.View>

        <Animated.View
          pointerEvents={screen === 'reader' ? 'auto' : 'none'}
          className="absolute inset-0"
          style={{
            opacity: readerProgress,
            transform: [
              {
                translateY: readerProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [isDark ? 18 : 28, 0],
                }),
              },
              {
                scale: readerProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [isDark ? 0.994 : 0.986, 1],
                }),
              },
            ],
          }}
        >
          <ChapterReader
            isDark={isDark}
            bookSlug={currentBookSlug}
            chapter={currentChapter}
            appBarHeight={appBarHeight}
            initialScrollPercent={initialScrollPercent}
            targetVerse={targetVerse}
            onProgressChange={(progress) => {
              const bookMeta = getBookMeta(progress.bookSlug);
              void updateReadingProgress({ ...progress, updatedAt: Date.now() });
              setCurrentVerseCount(progress.verseCount ?? 0);
              if (bookMeta) {
                void markChapterAsRead(progress.bookSlug, progress.chapter, bookMeta.chapters);
              }
            }}
            onHome={() => handleJumpTo('home')}
            onBooks={() => handleJumpTo('books')}
            onMarks={() => handleNavigateTo('marks')}
            onChapters={() => openChapters(currentBookSlug)}
            onVerses={() => openVerses(currentChapter)}
            marksRefreshKey={marksRefreshKey}
          />
        </Animated.View>
        <Animated.View
          pointerEvents={screen === 'chapters' ? 'auto' : 'none'}
          className="absolute inset-0"
          style={{
            zIndex: screen === 'chapters' ? 15 : 0,
            opacity: chaptersProgress,
            transform: [
              {
                translateY: chaptersProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [booksEnterY, 0],
                }),
              },
              {
                scale: chaptersProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hiddenScale, 1],
                }),
              },
            ],
          }}
        >
          <NumberGridScreen
            title={selectedBookMeta?.name ?? ''}
            subtitle="Selecciona capítulo"
            count={chapterCount}
            isDark={isDark}
            selectedNumber={selectedChapter}
            onSelect={(chapter) => openVerses(chapter)}
            onBack={handleGoBack}
            appBarHeight={appBarHeight}
            progress={chaptersProgress}
          />
        </Animated.View>

        <Animated.View
          pointerEvents={screen === 'verses' ? 'auto' : 'none'}
          className="absolute inset-0"
          style={{
            zIndex: screen === 'verses' ? 15 : 0,
            opacity: versesProgress,
            transform: [
              {
                translateY: versesProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [booksEnterY, 0],
                }),
              },
              {
                scale: versesProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hiddenScale, 1],
                }),
              },
            ],
          }}
        >
          <NumberGridScreen
            title={`Capítulo ${selectedChapter}`}
            subtitle="Selecciona versículo"
            count={currentVerseCount}
            isDark={isDark}
            onSelect={(verse) => {
              openReader(selectedBookSlug, selectedChapter, 0, verse);
            }}
            onBack={handleGoBack}
            appBarHeight={appBarHeight}
            progress={versesProgress}
          />
        </Animated.View>

        <Animated.View
          pointerEvents={screen === 'search' ? 'auto' : 'none'}
          className="absolute inset-0"
          style={{
            opacity: searchProgress,
            transform: [
              {
                translateY: searchProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [booksEnterY, 0],
                }),
              },
              {
                scale: searchProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hiddenScale, 1],
                }),
              },
            ],
          }}
        >
          <SearchScreen
            isDark={isDark}
            appBarHeight={appBarHeight}
            onResultPress={(bookSlug, chapter) => openReader(bookSlug, chapter, 0)}
          />
        </Animated.View>

        <Animated.View
          pointerEvents={screen === 'marks' ? 'auto' : 'none'}
          className="absolute inset-0"
          style={{
            opacity: marksProgress,
            transform: [
              {
                translateY: marksProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [booksEnterY, 0],
                }),
              },
              {
                scale: marksProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hiddenScale, 1],
                }),
              },
            ],
          }}
        >
          <MarksScreen
            isDark={isDark}
            active={screen === 'marks'}
            appBarHeight={appBarHeight}
            onClose={handleGoBack}
            onOpenMark={(bookSlug, chapter, verse) => openReader(bookSlug, chapter, 0, verse)}
            onMarkDeleted={() => setMarksRefreshKey((k) => k + 1)}
          />
        </Animated.View>
        <AppBar
          screen={screen === 'home' ? 'home' : 'reader'}
          isDark={isDark}
          onBack={handleGoBack}
          onToggleTheme={toggleTheme}
          onHeightMeasured={setAppBarHeight}
        />
        <StatusBar hidden />
      </SafeAreaProvider>
    </PaperProvider>
  );
}

