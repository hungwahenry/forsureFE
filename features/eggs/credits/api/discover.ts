import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

export interface CreditsDiscoverResponse {
  rank: number;
  total: number;
  discoveredAt: string;
}

export function useDiscoverCredits() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<CreditsDiscoverResponse>(
        '/v1/eggs/credits/discover',
      );
      return res.data;
    },
  });
}
