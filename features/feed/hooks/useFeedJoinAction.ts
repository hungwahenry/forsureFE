import { useJoinActivity } from '@/features/activities/join/api/joinActivity';
import { useListChats } from '@/features/chats/api/listChats';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import * as React from 'react';
import {
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import type { FeedItem, FeedPage } from '../types';

const PROXIMITY_MS = 2 * 60 * 60 * 1000; // 2 hours

export interface ProximityWarning {
  item: FeedItem;
  conflictTitle: string;
}

export interface FeedJoinAction {
  join: (item: FeedItem) => void;
  warning: ProximityWarning | null;
  confirm: () => void;
  cancel: () => void;
}

export function useFeedJoinAction(): FeedJoinAction {
  const queryClient = useQueryClient();
  const joinMutation = useJoinActivity();
  const chats = useListChats();
  const [warning, setWarning] = React.useState<ProximityWarning | null>(null);

  const execute = React.useCallback(
    async (item: FeedItem): Promise<void> => {
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
                  items: p.items.filter((i) => i.id !== item.id),
                })),
              }
            : data,
      );

      try {
        await joinMutation.mutateAsync(item.id);
        toast.success("you're going.");
      } catch (err) {
        snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
        const message =
          err instanceof ApiError ? err.message : "couldn't join. try again.";
        toast.error(message);
      }
    },
    [queryClient, joinMutation],
  );

  const join = React.useCallback(
    (item: FeedItem) => {
      const targetTime = new Date(item.startsAt).getTime();
      const conflict = (chats.data ?? []).find(
        (c) =>
          c.status === 'OPEN' &&
          Math.abs(new Date(c.startsAt).getTime() - targetTime) < PROXIMITY_MS,
      );
      if (conflict) {
        setWarning({ item, conflictTitle: conflict.title });
      } else {
        void execute(item);
      }
    },
    [chats.data, execute],
  );

  const confirm = React.useCallback(() => {
    if (!warning) return;
    const item = warning.item;
    setWarning(null);
    void execute(item);
  }, [warning, execute]);

  const cancel = React.useCallback(() => setWarning(null), []);

  return { join, warning, confirm, cancel };
}
