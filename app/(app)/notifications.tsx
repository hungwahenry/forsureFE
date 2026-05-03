import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useInbox, useMarkRead } from '@/features/inbox/api/inbox';
import { NotificationRow } from '@/features/inbox/components/NotificationRow';
import type { NotificationItem } from '@/features/inbox/types';
import { routeForNotification } from '@/features/notifications/route';
import { usePullRefresh } from '@/lib/hooks/usePullRefresh';
import { useRouter } from 'expo-router';
import { ArrowLeft, Notification, Setting2 } from 'iconsax-react-nativejs';
import * as React from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const inbox = useInbox();
  const markRead = useMarkRead();
  const refresh = usePullRefresh(inbox.refetch);

  const items: NotificationItem[] = React.useMemo(
    () => inbox.data?.pages.flatMap((p) => p.items) ?? [],
    [inbox.data],
  );

  const hasUnread = React.useMemo(() => items.some((i) => !i.readAt), [items]);

  const onTapItem = (item: NotificationItem) => {
    if (!item.readAt) markRead.mutate([item.id]);
    const target = routeForNotification(item.data);
    if (target) router.push(target as never);
  };

  const onMarkAll = () => {
    if (!hasUnread) return;
    markRead.mutate(undefined);
  };

  const onEndReached = () => {
    if (inbox.hasNextPage && !inbox.isFetchingNextPage) {
      void inbox.fetchNextPage();
    }
  };

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          notifications
        </Text>
        <Pressable
          onPress={() => router.push('/notification-preferences' as never)}
          hitSlop={8}
        >
          <Icon as={Setting2} className="text-muted-foreground size-7" />
        </Pressable>
      </View>

      {hasUnread ? (
        <View className="border-border/40 flex-row justify-end border-b px-6 py-2">
          <Pressable
            onPress={onMarkAll}
            hitSlop={8}
            disabled={markRead.isPending}
          >
            <Text className="text-primary text-sm font-medium">
              mark all read
            </Text>
          </Pressable>
        </View>
      ) : null}

      {inbox.isPending ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Notification}
          title="no notifications yet"
          subtitle="when something happens, you'll find it here."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationRow item={item} onPress={() => onTapItem(item)} />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl {...refresh} />}
          ListFooterComponent={
            inbox.isFetchingNextPage ? (
              <View className="items-center py-6">
                <LoadingIndicator size={8} />
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}

