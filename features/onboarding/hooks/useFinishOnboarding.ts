import { useAuthStore } from '@/features/auth/stores/authStore';
import { getTokens, setTokens } from '@/lib/auth/tokenStorage';
import { useCompleteOnboarding } from '../api/completeOnboarding';
import { useOnboardingStore } from '../stores/onboardingStore';
import type {
  CompleteOnboardingPayload,
  CompleteOnboardingResponse,
} from '../types';

// Swaps the access token for one with `onboarded:true`; refresh token stays unchanged.
export function useFinishOnboarding() {
  const completeOnboarding = useCompleteOnboarding();
  const setUser = useAuthStore((s) => s.setUser);

  const finishOnboarding = async (): Promise<CompleteOnboardingResponse> => {
    const { draft, reset } = useOnboardingStore.getState();

    if (
      !draft.dateOfBirth ||
      !draft.gender ||
      !draft.avatarKey ||
      !draft.location
    ) {
      throw new Error('onboarding draft is incomplete');
    }

    const payload: CompleteOnboardingPayload = {
      username: draft.username,
      displayName: draft.displayName,
      dateOfBirth: draft.dateOfBirth.toISOString(),
      gender: draft.gender,
      avatarKey: draft.avatarKey,
      location: draft.location,
    };

    const result = await completeOnboarding.mutateAsync(payload);

    const existing = await getTokens();
    if (existing?.refreshToken) {
      await setTokens({
        accessToken: result.accessToken,
        refreshToken: existing.refreshToken,
      });
    }

    setUser(result.user);
    reset();

    return result;
  };

  return {
    finishOnboarding,
    isPending: completeOnboarding.isPending,
  };
}
