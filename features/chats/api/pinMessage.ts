import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

interface PinArgs {
  activityId: string;
  messageId: string;
}

export function usePinMessage() {
  return useMutation<void, unknown, PinArgs>({
    mutationFn: async ({ activityId, messageId }) => {
      await api.post(`/v1/chats/${activityId}/pin/${messageId}`);
    },
  });
}

export function useUnpinMessage() {
  return useMutation<void, unknown, string>({
    mutationFn: async (activityId) => {
      await api.delete(`/v1/chats/${activityId}/pin`);
    },
  });
}
