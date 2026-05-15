import { useRef } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { ChapterReader } from 'components/ChapterReader';
import { useProgressStore } from '../../stores/useProgressStore';
import { BOOKS_META, slugifyBookName } from '../../../data/biblia/books-meta';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'> & {
  isDark: boolean;
  appBarHeight: number;
};

export function ReaderScreen({ navigation, route, isDark, appBarHeight }: Props) {
  const { bookSlug, chapter, scrollPercent = 0, targetVerse } = route.params;
  const { updateReadingProgress, markChapterAsRead } = useProgressStore();
  const versesCountRef = useRef(0);

  const getBookMeta = (slug: string) => BOOKS_META.find((b) => slugifyBookName(b.name) === slug);

  const handleNextChapter = () => {
    const bookMeta = getBookMeta(bookSlug);
    if (!bookMeta) return;
    void markChapterAsRead(bookSlug, chapter, bookMeta.chapters);
    if (chapter < bookMeta.chapters) {
      navigation.navigate('Reader', { bookSlug, chapter: chapter + 1, scrollPercent: 0 });
    } else {
      const currentIndex = BOOKS_META.findIndex((b) => slugifyBookName(b.name) === bookSlug);
      const nextBook = BOOKS_META[currentIndex + 1];
      if (nextBook) {
        navigation.navigate('Reader', { bookSlug: slugifyBookName(nextBook.name), chapter: 1, scrollPercent: 0 });
      } else {
        navigation.navigate('Home');
      }
    }
  };

  return (
    <ChapterReader
      isDark={isDark}
      bookSlug={bookSlug}
      chapter={chapter}
      appBarHeight={appBarHeight}
      initialScrollPercent={scrollPercent}
      targetVerse={targetVerse}
      onProgressChange={(progress) => {
        const bookMeta = getBookMeta(progress.bookSlug);
        void updateReadingProgress({ ...progress, updatedAt: Date.now() });
        versesCountRef.current = progress.verseCount ?? 0;
        if (bookMeta) {
          void markChapterAsRead(progress.bookSlug, progress.chapter, bookMeta.chapters);
        }
      }}
      onHome={() => navigation.navigate('Home')}
      onBooks={() => navigation.navigate('Books')}
      onMarks={() => navigation.navigate('Marks')}
      onChapters={() => {
        const meta = getBookMeta(bookSlug);
        navigation.navigate('Chapters', {
          bookSlug,
          bookName: meta?.name ?? bookSlug,
          chapterCount: meta?.chapters ?? 0,
        });
      }}
      onVerses={() =>
        navigation.navigate('Verses', { bookSlug, chapter, verseCount: versesCountRef.current })
      }
      onNextChapter={handleNextChapter}
    />
  );
}
