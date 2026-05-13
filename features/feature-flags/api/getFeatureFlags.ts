import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { FeatureFlagsResponse } from '../types';

const FIVE_MIN = 5 * 60_000;

export const featureFlagsQueryKey = ['feature-flags'] as const;

export function useFeatureFlagsQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: featureFlagsQueryKey,
    queryFn: async () => {
      const res = await api.get<FeatureFlagsResponse>('/v1/feature-flags');
      return res.data;
    },
    enabled,
    staleTime: FIVE_MIN,
    refetchInterval: FIVE_MIN,
    refetchOnWindowFocus: true,
  });
}
