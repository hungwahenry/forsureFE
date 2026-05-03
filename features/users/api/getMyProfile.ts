import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { MyProfile } from '../types';

export const myProfileQueryKey = () => ['users', 'me'] as const;

export function useMyProfile(enabled = true) {
  return useQuery({
    queryKey: myProfileQueryKey(),
    queryFn: async () => {
      const res = await api.get<MyProfile>('/v1/users/me');
      return res.data;
    },
    enabled,
  });
}
