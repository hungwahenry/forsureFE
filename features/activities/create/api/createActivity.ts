import { api } from '@/lib/api/client';
import { CHATS_QUERY_KEY } from '@/features/chats/api/listChats';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Activity, CreateActivityPayload } from '../../types';

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation<Activity, unknown, CreateActivityPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<Activity>('/v1/activities', payload);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      void queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
}
