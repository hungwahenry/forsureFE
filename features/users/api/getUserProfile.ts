import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { UserProfile } from '../types';

export const userProfileQueryKey = (username: string) =>
  ['users', username] as const;

export function useUserProfile(username: string, enabled = true) {
  return useQuery({
    queryKey: userProfileQueryKey(username),
    queryFn: async () => {
      const res = await api.get<UserProfile>(
        `/v1/users/${encodeURIComponent(username)}`,
      );
      return res.data;
    },
    enabled: enabled && username.length > 0,
  });
}
