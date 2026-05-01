import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

export function useMarkChatRead() {
  return useMutation<void, unknown, { activityId: string }>({
    mutationFn: async ({ activityId }) => {
      await api.post(`/v1/chats/${activityId}/read`);
    },
  });
}
