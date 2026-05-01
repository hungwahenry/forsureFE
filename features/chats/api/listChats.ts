import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { ChatPreview } from '../types';

export const CHATS_QUERY_KEY = ['chats'] as const;

export function useListChats(enabled = true) {
  return useQuery({
    queryKey: CHATS_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<ChatPreview[]>('/v1/chats');
      return res.data;
    },
    enabled,
  });
}
