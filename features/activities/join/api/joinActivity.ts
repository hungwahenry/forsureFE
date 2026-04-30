import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

export function useJoinActivity() {
  return useMutation<void, unknown, string>({
    mutationFn: async (activityId) => {
      await api.post(`/v1/activities/${activityId}/join`);
    },
  });
}

export function useLeaveActivity() {
  return useMutation<void, unknown, string>({
    mutationFn: async (activityId) => {
      await api.post(`/v1/activities/${activityId}/leave`);
    },
  });
}
