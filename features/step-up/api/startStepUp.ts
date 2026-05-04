import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { StepUpAction, StepUpStartResponse } from '../types';

export function useStartStepUp() {
  return useMutation({
    mutationFn: async (action: StepUpAction) => {
      const res = await api.post<StepUpStartResponse>('/v1/step-up', { action });
      return res.data;
    },
  });
}
