import { api } from '@/lib/api/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { MessagesPage } from '../types';

export const messagesQueryKey = (activityId: string) =>
  ['chats', activityId, 'messages'] as const;

export function useListMessages(activityId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: messagesQueryKey(activityId),
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = {};
      if (pageParam) params.cursor = pageParam;
      const res = await api.get<MessagesPage>(
        `/v1/chats/${activityId}/messages`,
        { params },
      );
      return res.data;
    },
    getNextPageParam: (last) => last.pageInfo.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled,
  });
}
