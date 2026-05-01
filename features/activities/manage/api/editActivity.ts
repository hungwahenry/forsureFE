import { api } from '@/lib/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Activity, EditActivityPayload } from '../../types';

interface EditArgs {
  activityId: string;
  patch: EditActivityPayload;
}

export function useEditActivity() {
  const queryClient = useQueryClient();
  return useMutation<Activity, unknown, EditArgs>({
    mutationFn: async ({ activityId, patch }) => {
      const res = await api.patch<Activity>(
        `/v1/activities/${activityId}`,
        patch,
      );
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
