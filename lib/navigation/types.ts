export type RootStackParamList = {
  Home: undefined;
  Books: undefined;
  Chapters: { bookSlug: string; bookName: string; chapterCount: number };
  Verses: { bookSlug: string; chapter: number; verseCount: number };
  Reader: { bookSlug: string; chapter: number; scrollPercent?: number; targetVerse?: number };
  Search: undefined;
  Marks: undefined;
};
