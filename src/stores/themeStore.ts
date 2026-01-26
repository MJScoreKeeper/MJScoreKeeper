import { create } from 'zustand';
import { THEMES, DEFAULT_THEME } from '../constants/themes';
import type { ThemeId, Theme } from '../constants/themes';

const STORAGE_KEY = 'mahjong-theme';

interface ThemeState {
  themeId: ThemeId;
  theme: Theme;
  setTheme: (themeId: ThemeId) => void;
  loadTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeId: DEFAULT_THEME,
  theme: THEMES[DEFAULT_THEME],

  setTheme: (themeId: ThemeId) => {
    localStorage.setItem(STORAGE_KEY, themeId);
    set({ themeId, theme: THEMES[themeId] });
  },

  loadTheme: () => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && THEMES[stored]) {
      set({ themeId: stored, theme: THEMES[stored] });
    }
  },
}));
