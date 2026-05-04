import { api } from '@/lib/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BlockedListResponse } from '../types';

export const blocksQueryKey = () => ['blocks'] as const;

export function useBlockedUsers(enabled = true) {
  return useQuery({
    queryKey: blocksQueryKey(),
    queryFn: async () => {
      const res = await api.get<BlockedListResponse>('/v1/blocks');
      return res.data.items;
    },
    enabled,
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await api.post('/v1/blocks', { userId });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: blocksQueryKey() });
    },
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/v1/blocks/${encodeURIComponent(userId)}`);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: blocksQueryKey() });
    },
  });
}
