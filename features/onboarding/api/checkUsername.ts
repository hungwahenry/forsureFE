import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';

interface CheckUsernameResponse {
  available: boolean;
}

export async function checkUsername(username: string): Promise<boolean> {
  const res = await api.get<CheckUsernameResponse>(
    '/v1/onboarding/username-available',
    { params: { username } },
  );
  return res.data.available;
}

export function useCheckUsername(username: string, enabled: boolean) {
  return useQuery({
    queryKey: ['onboarding', 'username-available', username],
    queryFn: () => checkUsername(username),
    enabled,
    staleTime: 30_000,
    retry: false,
  });
}
