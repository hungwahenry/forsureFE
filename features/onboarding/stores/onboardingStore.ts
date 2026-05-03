import type { Gender } from '@/features/users/types';
import { create } from 'zustand';
import type { LocationCoords } from '../types';

export interface OnboardingDraft {
  username: string;
  displayName: string;
  dateOfBirth: Date | null;
  /** Storage key returned by POST /onboarding/avatar — what we submit. */
  avatarKey: string | null;
  /** Public URL returned alongside the key — used for preview. */
  avatarUrl: string | null;
  gender: Gender | null;
  location: LocationCoords | null;
}

const initialDraft: OnboardingDraft = {
  username: '',
  displayName: '',
  dateOfBirth: null,
  avatarKey: null,
  avatarUrl: null,
  gender: null,
  location: null,
};

interface OnboardingState {
  draft: OnboardingDraft;
  setField: <K extends keyof OnboardingDraft>(
    key: K,
    value: OnboardingDraft[K]
  ) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  draft: initialDraft,
  setField: (key, value) =>
    set((s) => ({ draft: { ...s.draft, [key]: value } })),
  reset: () => set({ draft: initialDraft }),
}));
