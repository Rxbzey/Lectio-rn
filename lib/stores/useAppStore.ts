import { create } from 'zustand';

type Screen = 'home' | 'books' | 'chapters' | 'verses' | 'reader' | 'search' | 'marks';

interface AppStore {
  // Navigation state
  screen: Screen;
  screenStack: Screen[];

  // Navigation actions
  navigateTo: (nextScreen: Screen) => void;
  jumpTo: (target: Screen) => void;
  goBack: () => void;
  resetToHome: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  screen: 'home',
  screenStack: ['home'],

  navigateTo: (nextScreen) =>
    set((state) => {
      if (nextScreen === state.screen) return state;
      return {
        screen: nextScreen,
        screenStack: [...state.screenStack, nextScreen],
      };
    }),

  jumpTo: (target) =>
    set((state) => {
      if (target === state.screen) return state;
      const existing = state.screenStack.lastIndexOf(target);
      const newStack: Screen[] =
        existing !== -1
          ? state.screenStack.slice(0, existing + 1)
          : ['home', target];
      return {
        screen: target,
        screenStack: newStack,
      };
    }),

  goBack: () =>
    set((state) => {
      const stack = state.screenStack;
      if (stack.length <= 1) return state;
      const newStack = stack.slice(0, -1);
      const prev = newStack[newStack.length - 1];
      return {
        screen: prev,
        screenStack: newStack,
      };
    }),

  resetToHome: () =>
    set({
      screen: 'home',
      screenStack: ['home'],
    }),
}));
