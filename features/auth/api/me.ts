import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { MeResponse } from '../types';

export const ME_QUERY_KEY = ['auth', 'me'] as const;

/**
 * Imperative fetch — used by the auth-store bootstrap on cold start so we
 * can validate stored tokens with the server before deciding the auth
 * status. The 401-refresh-retry interceptor wraps this call automatically.
 */
export async function fetchMe(): Promise<MeResponse> {
  const res = await api.get<MeResponse>('/v1/auth/me');
  return res.data;
}

/** Hook-based variant for components that want to subscribe to /me. */
export function useMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
  });
}
