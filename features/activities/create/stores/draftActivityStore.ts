import type { PickedPlace } from '@/features/places/types';
import { create } from 'zustand';
import type { ActivityGenderPreference } from '../../types';

export interface ActivityDraft {
  emoji: string | null;
  title: string;
  startsAt: Date | null;
  place: PickedPlace | null;
  capacity: number;
  genderPreference: ActivityGenderPreference;
  memoriesShareablePublicly: boolean;
}

const initialDraft: ActivityDraft = {
  emoji: null,
  title: '',
  startsAt: null,
  place: null,
  capacity: 3,
  genderPreference: 'ALL',
  memoriesShareablePublicly: false,
};

interface DraftActivityState {
  draft: ActivityDraft;
  setField: <K extends keyof ActivityDraft>(
    key: K,
    value: ActivityDraft[K],
  ) => void;
  reset: () => void;
}

export const useDraftActivityStore = create<DraftActivityState>((set) => ({
  draft: initialDraft,
  setField: (key, value) =>
    set((s) => ({ draft: { ...s.draft, [key]: value } })),
  reset: () => set({ draft: initialDraft }),
}));

export function isDraftActivityComplete(draft: ActivityDraft): boolean {
  return (
    !!draft.emoji &&
    !!draft.title.trim() &&
    !!draft.startsAt &&
    !!draft.place
  );
}
