import { useJoinActivity } from '@/features/activities/join/api/joinActivity';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import {
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import type { FeedPage } from '../types';

/**
 * Orchestrates a join initiated from the feed: optimistically removes the
 * activity from every cached feed page, fires the API call, and rolls back +
 * surfaces a toast if the server rejects.
 */
export function useFeedJoinAction() {
  const queryClient = useQueryClient();
  const join = useJoinActivity();

  return async (activityId: string): Promise<void> => {
    await queryClient.cancelQueries({ queryKey: ['feed'] });
    const snapshot = queryClient.getQueriesData<InfiniteData<FeedPage>>({
      queryKey: ['feed'],
    });

    queryClient.setQueriesData<InfiniteData<FeedPage>>(
      { queryKey: ['feed'] },
      (data) =>
        data
          ? {
              ...data,
              pages: data.pages.map((p) => ({
                ...p,
                items: p.items.filter((i) => i.id !== activityId),
              })),
            }
          : data,
    );

    try {
      await join.mutateAsync(activityId);
      toast.success("you're going.");
    } catch (err) {
      snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      const message =
        err instanceof ApiError ? err.message : "couldn't join. try again.";
      toast.error(message);
    }
  };
}
