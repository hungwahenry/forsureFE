import type { PickedPlace } from '@/features/places/types';
import { create } from 'zustand';
import type { ActivityGenderPreference } from '../types';

export interface ActivityDraft {
  emoji: string | null;
  title: string;
  startsAt: Date | null;
  place: PickedPlace | null;
  capacity: number;
  genderPreference: ActivityGenderPreference;
}

const initialDraft: ActivityDraft = {
  emoji: null,
  title: '',
  startsAt: null,
  place: null,
  capacity: 3,
  genderPreference: 'ALL',
};

interface DraftActivityState {
  draft: ActivityDraft;
  setField: <K extends keyof ActivityDraft>(
    key: K,
    value: ActivityDraft[K],
  ) => void;
  reset: () => void;
}

/**
 * Holds the in-progress activity while the user fills the mad-libs sheet.
 * Reset on close + on successful submit.
 */
export const useDraftActivityStore = create<DraftActivityState>((set) => ({
  draft: initialDraft,
  setField: (key, value) =>
    set((s) => ({ draft: { ...s.draft, [key]: value } })),
  reset: () => set({ draft: initialDraft }),
}));
