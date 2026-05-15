import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { ClientConfigResponse } from '../types';

const FIVE_MIN = 5 * 60_000;

export const configQueryKey = ['config'] as const;

export function useConfigQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: configQueryKey,
    queryFn: async () => {
      const res = await api.get<ClientConfigResponse>('/v1/config');
      return res.data;
    },
    enabled,
    staleTime: FIVE_MIN,
    refetchInterval: FIVE_MIN,
    refetchOnWindowFocus: true,
  });
}
