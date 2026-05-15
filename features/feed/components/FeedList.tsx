import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { usePullRefresh } from '@/lib/hooks/usePullRefresh';
import { useFocusEffect, useRouter } from 'expo-router';
import { Calendar } from 'iconsax-react-nativejs';
import * as React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useFeed } from '../api/feed';
import { useFeedJoinAction } from '../hooks/useFeedJoinAction';
import type { FeedItem } from '../types';
import { FeedItemView } from './FeedItemView';

interface FeedListProps {
  lat: number;
  lng: number;
}

export function FeedList({ lat, lng }: FeedListProps) {
  const router = useRouter();
  const feed = useFeed({ lat, lng });
  const { join, confirmation, confirmJoin, cancelJoin, warning, confirm, cancel } = useFeedJoinAction();
  const refresh = usePullRefresh(feed.refetch);

  const items: FeedItem[] = React.useMemo(
    () => feed.data?.pages.flatMap((p) => p.items) ?? [],
    [feed.data],
  );

  useFocusEffect(
    React.useCallback(() => {
      void feed.refetch();
    }, [feed.refetch]),
  );

  const onEndReached = () => {
    if (feed.hasNextPage && !feed.isFetchingNextPage) {
      void feed.fetchNextPage();
    }
  };

  if (feed.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingIndicator size={10} />
      </View>
    );
  }

  if (feed.isError && items.length === 0) {
    return (
      <ErrorState
        title="couldn't load activities"
        onRetry={() => void feed.refetch()}
      />
    );
  }

  if (items.length === 0 && !feed.isFetching) {
    return (
      <EmptyState
        icon={Calendar}
        title="nothing nearby yet"
        subtitle="be the first to start something — your activity will show up here."
        actions={
          <Button onPress={() => router.push('/create-activity')} size="lg">
            <Text>create one</Text>
          </Button>
        }
      />
    );
  }

  return (
    <View className="flex-1">
      <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <FeedItemView
          item={item}
          index={index}
          onPress={() => undefined}
          onJoinPress={() => void join(item)}
        />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl {...refresh} />}
      ListFooterComponent={
        feed.isFetchingNextPage ? (
          <View className="items-center py-6">
            <LoadingIndicator size={8} />
          </View>
        ) : null
      }
    />

    <AlertDialog open={!!confirmation}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>join {confirmation?.emoji} {confirmation?.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            you'll be added to the group chat and your spot will be reserved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={cancelJoin}>
            <Text>cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={confirmJoin}>
            <Text>join</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={!!warning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>heads up</AlertDialogTitle>
          <AlertDialogDescription>
            you're already going to "{warning?.conflictTitle}" around the same time. still want to join?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={cancel}>
            <Text>cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={confirm}>
            <Text>join anyway</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </View>
  );
}
