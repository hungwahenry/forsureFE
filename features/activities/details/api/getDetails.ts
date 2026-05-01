import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { ActivityDetails } from '../../types';

export const activityDetailsQueryKey = (activityId: string) =>
  ['activities', activityId, 'details'] as const;

export function useActivityDetails(activityId: string, enabled = true) {
  return useQuery({
    queryKey: activityDetailsQueryKey(activityId),
    queryFn: async () => {
      const res = await api.get<ActivityDetails>(
        `/v1/activities/${activityId}`,
      );
      return res.data;
    },
    enabled,
  });
}
