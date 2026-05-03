import { api } from '@/lib/api/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { UserActivitiesPage } from '../types';

export const userActivitiesQueryKey = (username: string) =>
  ['users', username, 'activities'] as const;

export function useUserActivities(username: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: userActivitiesQueryKey(username),
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = {};
      if (pageParam) params.cursor = pageParam;
      const res = await api.get<UserActivitiesPage>(
        `/v1/users/${encodeURIComponent(username)}/activities`,
        { params },
      );
      return res.data;
    },
    getNextPageParam: (last) => last.pageInfo.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: enabled && username.length > 0,
  });
}
