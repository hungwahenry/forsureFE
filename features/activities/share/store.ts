import { create } from 'zustand';
import type { SharableActivity } from './components/ActivityShareCard';

interface ShareTargetState {
  target: SharableActivity | null;
  setTarget: (next: SharableActivity) => void;
  clear: () => void;
}

/** Holds the activity to render on the share screen. Set by the trigger,
 *  read by /share-activity, cleared on screen unmount. */
export const useShareTargetStore = create<ShareTargetState>((set) => ({
  target: null,
  setTarget: (next) => set({ target: next }),
  clear: () => set({ target: null }),
}));
