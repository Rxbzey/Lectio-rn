import { create } from 'zustand';
import { readTheme, saveTheme } from '../theme';

interface ThemeStore {
  isDark: boolean;
  initialized: boolean;
  toggleTheme: () => Promise<void>;
  initializeTheme: (systemDark: boolean) => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: false,
  initialized: false,

  toggleTheme: async () => {
    const newDark = !get().isDark;
    await saveTheme(newDark);
    set({ isDark: newDark });
  },

  initializeTheme: async (systemDark: boolean) => {
    if (get().initialized) return;
    const saved = await readTheme();
    set({ isDark: saved === 'dark' ? true : saved === 'light' ? false : systemDark, initialized: true });
  },
}));
