import { create } from 'zustand';
import {
  readReadingProgress,
  saveReadingProgress,
  type ReadingProgress,
} from '../readingProgress';
import {
  readBookProgressMap,
  markChapterRead,
  type BookProgressMap,
} from '../bookProgress';

interface ProgressStore {
  readingProgress: ReadingProgress | null;
  bookProgressMap: BookProgressMap;
  initialized: boolean;

  initializeProgress: () => Promise<void>;
  updateReadingProgress: (progress: ReadingProgress) => Promise<void>;
  markChapterAsRead: (bookSlug: string, chapter: number, totalChapters: number) => Promise<void>;
  refreshBookProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  readingProgress: null,
  bookProgressMap: {},
  initialized: false,

  initializeProgress: async () => {
    if (get().initialized) return;
    const [progress, bookMap] = await Promise.all([
      readReadingProgress(),
      readBookProgressMap(),
    ]);
    set({
      readingProgress: progress,
      bookProgressMap: bookMap,
      initialized: true,
    });
  },

  updateReadingProgress: async (progress) => {
    await saveReadingProgress(progress);
    set({ readingProgress: progress });
  },

  markChapterAsRead: async (bookSlug: string, chapter: number, totalChapters: number) => {
    await markChapterRead(bookSlug, chapter, totalChapters);
    const bookMap = await readBookProgressMap();
    set({ bookProgressMap: bookMap });
  },

  refreshBookProgress: async () => {
    const bookMap = await readBookProgressMap();
    set({ bookProgressMap: bookMap });
  },
}));
