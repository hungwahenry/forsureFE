import { api } from '@/lib/api/client';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { InboxPage, UnreadCountResponse } from '../types';

export const inboxQueryKey = () => ['inbox'] as const;
export const unreadCountQueryKey = () => ['inbox', 'unread-count'] as const;

export function useInbox() {
  return useInfiniteQuery({
    queryKey: inboxQueryKey(),
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = {};
      if (pageParam) params.cursor = pageParam;
      const res = await api.get<InboxPage>('/v1/inbox', { params });
      return res.data;
    },
    getNextPageParam: (last) => last.pageInfo.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });
}

export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: unreadCountQueryKey(),
    queryFn: async () => {
      const res = await api.get<UnreadCountResponse>('/v1/inbox/unread-count');
      return res.data.count;
    },
    enabled,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids?: string[]) => {
      await api.post('/v1/inbox/read', ids ? { ids } : {});
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: inboxQueryKey() });
      void qc.invalidateQueries({ queryKey: unreadCountQueryKey() });
    },
  });
}
