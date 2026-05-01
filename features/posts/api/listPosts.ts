import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { ActivityPost } from '../types';

export const activityPostsQueryKey = (activityId: string) =>
  ['memories', activityId, 'posts'] as const;

export function useActivityPosts(activityId: string, enabled = true) {
  return useQuery({
    queryKey: activityPostsQueryKey(activityId),
    queryFn: async () => {
      const res = await api.get<ActivityPost[]>(
        `/v1/activities/${activityId}/posts`,
      );
      return res.data;
    },
    enabled,
  });
}
