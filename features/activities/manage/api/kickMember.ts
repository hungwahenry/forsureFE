import { api } from '@/lib/api/client';
import { activityDetailsQueryKey } from '@/features/activities/details/api/getDetails';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface KickArgs {
  activityId: string;
  userId: string;
}

export function useKickMember() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, KickArgs>({
    mutationFn: async ({ activityId, userId }) => {
      await api.delete(
        `/v1/activities/${activityId}/participants/${userId}`,
      );
    },
    onSuccess: (_data, { activityId }) => {
      void queryClient.invalidateQueries({
        queryKey: activityDetailsQueryKey(activityId),
      });
    },
  });
}
