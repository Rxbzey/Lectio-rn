import { storageGet, storageSet } from './storage';

export type MarkColor = 'amber' | 'rose' | 'sage' | 'sky';

export interface VerseMark {
  id: string;
  bookSlug: string;
  bookName: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  verseTexts: { number: number; text: string }[];
  color: MarkColor;
  reflection?: string;
  createdAt: number;
}

export interface MarkColorConfig {
  color: MarkColor;
  name: string;
}

const MARKS_KEY = 'lectio:verse-marks';
const COLOR_CONFIG_KEY = 'lectio:mark-color-config';

export const DEFAULT_COLOR_NAMES: Record<MarkColor, string> = {
  amber: 'Reflexión',
  rose: 'Fe',
  sage: 'Esperanza',
  sky: 'Meditación',
};

export const MARK_PALETTE: Record<MarkColor, { dot: string; bg: string; bgDark: string; border: string; borderDark: string }> = {
  amber: {
    dot: '#f59e0b',
    bg: 'rgba(251,211,141,0.32)',
    bgDark: 'rgba(251,191,36,0.15)',
    border: 'rgba(217,160,40,0.50)',
    borderDark: 'rgba(251,191,36,0.36)',
  },
  rose: {
    dot: '#f43f5e',
    bg: 'rgba(253,164,175,0.28)',
    bgDark: 'rgba(251,113,133,0.15)',
    border: 'rgba(225,50,80,0.42)',
    borderDark: 'rgba(251,113,133,0.34)',
  },
  sage: {
    dot: '#4ade80',
    bg: 'rgba(167,210,167,0.28)',
    bgDark: 'rgba(134,239,172,0.13)',
    border: 'rgba(74,160,74,0.42)',
    borderDark: 'rgba(134,239,172,0.30)',
  },
  sky: {
    dot: '#60a5fa',
    bg: 'rgba(147,197,253,0.26)',
    bgDark: 'rgba(147,197,253,0.12)',
    border: 'rgba(56,130,210,0.42)',
    borderDark: 'rgba(147,197,253,0.30)',
  },
};

export type VerseMarksStore = VerseMark[];

export async function readVerseMarks(): Promise<VerseMarksStore> {
  return (await storageGet<VerseMarksStore>(MARKS_KEY)) ?? [];
}

export async function saveVerseMark(mark: VerseMark): Promise<VerseMarksStore> {
  const marks = await readVerseMarks();
  const filtered = marks.filter((m) => m.id !== mark.id);
  const updated = [mark, ...filtered];
  await storageSet(MARKS_KEY, updated);
  return updated;
}

export async function updateMarkReflection(id: string, reflection: string): Promise<VerseMarksStore> {
  const marks = await readVerseMarks();
  const updated = marks.map((m) => (m.id === id ? { ...m, reflection } : m));
  await storageSet(MARKS_KEY, updated);
  return updated;
}

export async function deleteVerseMark(id: string): Promise<VerseMarksStore> {
  const marks = await readVerseMarks();
  const updated = marks.filter((m) => m.id !== id);
  await storageSet(MARKS_KEY, updated);
  return updated;
}

export function getMarkForVerse(
  marks: VerseMarksStore,
  bookSlug: string,
  chapter: number,
  verseNumber: number,
): VerseMark | undefined {
  return marks.find(
    (m) =>
      m.bookSlug === bookSlug &&
      m.chapter === chapter &&
      m.verseStart <= verseNumber &&
      m.verseEnd >= verseNumber,
  );
}

export async function readColorConfig(): Promise<Record<MarkColor, string>> {
  const saved = await storageGet<Partial<Record<MarkColor, string>>>(COLOR_CONFIG_KEY);
  return {
    amber: saved?.amber ?? DEFAULT_COLOR_NAMES.amber,
    rose: saved?.rose ?? DEFAULT_COLOR_NAMES.rose,
    sage: saved?.sage ?? DEFAULT_COLOR_NAMES.sage,
    sky: saved?.sky ?? DEFAULT_COLOR_NAMES.sky,
  };
}

export async function saveColorConfig(config: Record<MarkColor, string>): Promise<void> {
  await storageSet(COLOR_CONFIG_KEY, config);
}

export function makeMarkId(bookSlug: string, chapter: number, verseStart: number, verseEnd: number): string {
  return `${bookSlug}-${chapter}-${verseStart}-${verseEnd}`;
}
