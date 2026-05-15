import { create } from 'zustand';
import {
  readVerseMarks,
  saveVerseMark,
  updateMarkReflection,
  deleteVerseMark,
  readColorConfig,
  saveColorConfig,
  DEFAULT_COLOR_NAMES,
  type VerseMark,
  type MarkColor,
  type VerseMarksStore,
} from '../verseMarks';

interface MarksStore {
  marks: VerseMarksStore;
  colorConfig: Record<MarkColor, string>;
  initialized: boolean;

  initializeMarks: () => Promise<void>;
  saveMark: (mark: VerseMark) => Promise<void>;
  updateReflection: (id: string, reflection: string) => Promise<void>;
  deleteMark: (id: string) => Promise<void>;
  saveColorConfig: (config: Record<MarkColor, string>) => Promise<void>;
}

export const useMarksStore = create<MarksStore>((set, get) => ({
  marks: [],
  colorConfig: DEFAULT_COLOR_NAMES,
  initialized: false,

  initializeMarks: async () => {
    if (get().initialized) return;
    const [marks, colorConfig] = await Promise.all([
      readVerseMarks(),
      readColorConfig(),
    ]);
    set({ marks, colorConfig, initialized: true });
  },

  saveMark: async (mark) => {
    const updated = await saveVerseMark(mark);
    set({ marks: updated });
  },

  updateReflection: async (id, reflection) => {
    const updated = await updateMarkReflection(id, reflection);
    set({ marks: updated });
  },

  deleteMark: async (id) => {
    const updated = await deleteVerseMark(id);
    set({ marks: updated });
  },

  saveColorConfig: async (config) => {
    await saveColorConfig(config);
    set({ colorConfig: config });
  },
}));
