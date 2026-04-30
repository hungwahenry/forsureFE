import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
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
  const join = useFeedJoinAction();

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
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FeedItemView
          item={item}
          onPress={() => undefined}
          onJoinPress={() => void join(item.id)}
        />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={feed.isRefetching && !feed.isFetchingNextPage}
          onRefresh={() => void feed.refetch()}
        />
      }
      ListFooterComponent={
        feed.isFetchingNextPage ? (
          <View className="items-center py-6">
            <LoadingIndicator size={8} />
          </View>
        ) : null
      }
    />
  );
}
