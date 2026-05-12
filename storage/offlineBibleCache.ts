import { Platform } from 'react-native';
import type { Book, ChapterResponse } from '../lib/api';

const BOOKS_KEY = 'lectio:books-cache';
const CHAPTER_PREFIX = 'lectio:chapter-cache:';
const memory = new Map<string, unknown>();

function canUseLocalStorage(): boolean {
  return Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined';
}

async function readJson<T>(key: string): Promise<T | null> {
  if (!canUseLocalStorage()) return (memory.get(key) as T | undefined) ?? null;
  const raw = globalThis.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  memory.set(key, value);
  if (canUseLocalStorage()) {
    globalThis.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function readCachedBooks(): Promise<Book[] | null> {
  return readJson<Book[]>(BOOKS_KEY);
}

export function cacheBooks(books: Book[]): Promise<void> {
  return writeJson(BOOKS_KEY, books);
}

export function readCachedChapter(bookSlug: string, chapter: number): Promise<ChapterResponse | null> {
  return readJson<ChapterResponse>(`${CHAPTER_PREFIX}${bookSlug}:${chapter}`);
}

export function cacheChapter(bookSlug: string, chapter: number, data: ChapterResponse): Promise<void> {
  return writeJson(`${CHAPTER_PREFIX}${bookSlug}:${chapter}`, data);
}
