import { storageGet, storageSet } from './storage';

const KEY = 'lectio:theme';

export async function readTheme(): Promise<'dark' | 'light' | null> {
  return storageGet<'dark' | 'light'>(KEY);
}

export async function saveTheme(isDark: boolean): Promise<void> {
  await storageSet(KEY, isDark ? 'dark' : 'light');
}
