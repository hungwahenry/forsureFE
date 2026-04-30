import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { MeResponse } from '../types';

export const ME_QUERY_KEY = ['auth', 'me'] as const;

export async function fetchMe(): Promise<MeResponse> {
  const res = await api.get<MeResponse>('/v1/auth/me');
  return res.data;
}

export function useMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
  });
}
