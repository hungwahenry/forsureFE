import { create } from 'zustand';
import { getHapticsPref, setHapticsPref } from '../storage';

interface HapticsState {
  enabled: boolean;
  hydrated: boolean;
  bootstrap: () => Promise<void>;
  setEnabled: (next: boolean) => Promise<void>;
}

export const useHapticsStore = create<HapticsState>((set) => ({
  enabled: true,
  hydrated: false,

  bootstrap: async () => {
    const enabled = await getHapticsPref();
    set({ enabled, hydrated: true });
  },

  setEnabled: async (next) => {
    set({ enabled: next });
    await setHapticsPref(next);
  },
}));
