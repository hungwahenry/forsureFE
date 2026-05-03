import { api } from '@/lib/api/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { UserPostsPage } from '../types';

export const userPostsQueryKey = (username: string) =>
  ['users', username, 'posts'] as const;

export function useUserPosts(username: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: userPostsQueryKey(username),
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = {};
      if (pageParam) params.cursor = pageParam;
      const res = await api.get<UserPostsPage>(
        `/v1/users/${encodeURIComponent(username)}/posts`,
        { params },
      );
      return res.data;
    },
    getNextPageParam: (last) => last.pageInfo.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: enabled && username.length > 0,
  });
}
