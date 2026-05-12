import { storageGet, storageSet } from './storage';

const KEY = 'lectio:last-reading-progress';

export interface ReadingProgress {
  bookSlug: string;
  bookName: string;
  chapter: number;
  scrollPercent: number;
  updatedAt: number;
}

export async function readReadingProgress(): Promise<ReadingProgress | null> {
  const parsed = await storageGet<ReadingProgress>(KEY);
  if (!parsed?.bookSlug || !parsed.bookName || !Number.isFinite(parsed.chapter)) return null;
  return parsed;
}

export async function saveReadingProgress(progress: ReadingProgress): Promise<void> {
  await storageSet(KEY, progress);
}
