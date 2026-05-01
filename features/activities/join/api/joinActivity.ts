import { api } from '@/lib/api/client';
import { CHATS_QUERY_KEY } from '@/features/chats/api/listChats';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useJoinActivity() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: async (activityId) => {
      await api.post(`/v1/activities/${activityId}/join`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      void queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
}

export function useLeaveActivity() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: async (activityId) => {
      await api.post(`/v1/activities/${activityId}/leave`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      void queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
}
