import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { ActivityPost } from '../types';

export const myActivityPostQueryKey = (activityId: string) =>
  ['memories', activityId, 'posts', 'me'] as const;

export function useMyActivityPost(activityId: string, enabled = true) {
  return useQuery({
    queryKey: myActivityPostQueryKey(activityId),
    queryFn: async () => {
      const res = await api.get<ActivityPost | null>(
        `/v1/activities/${activityId}/posts/me`,
      );
      return res.data;
    },
    enabled,
  });
}
