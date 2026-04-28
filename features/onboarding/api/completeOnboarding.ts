import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type {
  CompleteOnboardingPayload,
  CompleteOnboardingResponse,
} from '../types';

export function useCompleteOnboarding() {
  return useMutation<
    CompleteOnboardingResponse,
    unknown,
    CompleteOnboardingPayload
  >({
    mutationFn: async (payload) => {
      const res = await api.post<CompleteOnboardingResponse>(
        '/v1/onboarding/complete',
        payload,
      );
      return res.data;
    },
  });
}
