import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

interface DeleteMessageArgs {
  activityId: string;
  messageId: string;
}

export function useDeleteMessage() {
  return useMutation<void, unknown, DeleteMessageArgs>({
    mutationFn: async ({ activityId, messageId }) => {
      await api.delete(`/v1/chats/${activityId}/messages/${messageId}`);
    },
  });
}
