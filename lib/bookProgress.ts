import { storageGet, storageSet } from './storage';

const KEY = 'lectio:book-progress';

export type BookStatus = 'unread' | 'started' | 'completed';

export interface BookProgress {
  bookSlug: string;
  totalChapters: number;
  chaptersRead: number[];
  updatedAt: number;
}

export type BookProgressMap = Record<string, BookProgress>;

export async function readBookProgressMap(): Promise<BookProgressMap> {
  return (await storageGet<BookProgressMap>(KEY)) ?? {};
}

export async function markChapterRead(
  bookSlug: string,
  chapter: number,
  totalChapters: number,
): Promise<void> {
  const map = await readBookProgressMap();
  const existing = map[bookSlug];
  const chaptersRead = existing
    ? Array.from(new Set([...existing.chaptersRead, chapter]))
    : [chapter];
  map[bookSlug] = { bookSlug, totalChapters, chaptersRead, updatedAt: Date.now() };
  await storageSet(KEY, map);
}

export function getBookStatus(progress: BookProgress | undefined): BookStatus {
  if (!progress || progress.chaptersRead.length === 0) return 'unread';
  if (progress.chaptersRead.length >= progress.totalChapters) return 'completed';
  return 'started';
}
