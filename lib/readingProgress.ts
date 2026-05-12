import { Platform } from 'react-native';

const STORAGE_KEY = 'lectio:last-reading-progress';
let memoryProgress: ReadingProgress | null = null;

export interface ReadingProgress {
  bookSlug: string;
  bookName: string;
  chapter: number;
  scrollPercent: number;
  updatedAt: number;
}

function canUseLocalStorage(): boolean {
  return Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined';
}

export async function readReadingProgress(): Promise<ReadingProgress | null> {
  if (!canUseLocalStorage()) return memoryProgress;

  const raw = globalThis.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ReadingProgress;
    if (!parsed.bookSlug || !parsed.bookName || !Number.isFinite(parsed.chapter)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveReadingProgress(progress: ReadingProgress): Promise<void> {
  memoryProgress = progress;
  if (canUseLocalStorage()) {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}
