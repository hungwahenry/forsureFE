import { colorScheme } from 'nativewind';
import { create } from 'zustand';
import {
  getThemePref,
  setThemePref,
  type ThemePreference,
} from '../storage';

interface ThemeState {
  pref: ThemePreference;
  hydrated: boolean;
  bootstrap: () => Promise<void>;
  setTheme: (next: ThemePreference) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  pref: 'system',
  hydrated: false,

  bootstrap: async () => {
    const pref = await getThemePref();
    colorScheme.set(pref);
    set({ pref, hydrated: true });
  },

  setTheme: async (next) => {
    colorScheme.set(next);
    set({ pref: next });
    await setThemePref(next);
  },
}));
