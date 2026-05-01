import type { PickedPlace } from '@/features/places/types';
import { create } from 'zustand';
import type { ActivityDetails, ActivityGenderPreference } from '../../types';

export interface EditDraft {
  activityId: string;
  emoji: string;
  title: string;
  startsAt: Date;
  place: PickedPlace;
  capacity: number;
  genderPreference: ActivityGenderPreference;
  memoriesShareablePublicly: boolean;
}

interface EditDraftState {
  draft: EditDraft | null;
  initialize: (details: ActivityDetails) => void;
  setField: <K extends keyof Omit<EditDraft, 'activityId'>>(
    key: K,
    value: EditDraft[K],
  ) => void;
  reset: () => void;
}

export const useEditDraftStore = create<EditDraftState>((set) => ({
  draft: null,
  initialize: (details) =>
    set({
      draft: {
        activityId: details.id,
        emoji: details.emoji,
        title: details.title,
        startsAt: new Date(details.startsAt),
        place: {
          name: details.place.name,
          address: details.place.name,
          lat: details.place.lat,
          lng: details.place.lng,
        },
        capacity: details.capacity,
        genderPreference: details.genderPreference,
        memoriesShareablePublicly: details.memoriesShareablePublicly,
      },
    }),
  setField: (key, value) =>
    set((s) => (s.draft ? { draft: { ...s.draft, [key]: value } } : s)),
  reset: () => set({ draft: null }),
}));
