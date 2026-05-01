import { api } from '@/lib/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Activity } from '../../types';

export function useCancelActivity() {
  const queryClient = useQueryClient();
  return useMutation<Activity, unknown, string>({
    mutationFn: async (activityId) => {
      const res = await api.post<Activity>(
        `/v1/activities/${activityId}/cancel`,
      );
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
