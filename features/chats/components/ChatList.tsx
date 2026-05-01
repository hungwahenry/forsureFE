import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { useFocusEffect, useRouter } from 'expo-router';
import { Message } from 'iconsax-react-nativejs';
import * as React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useListChats } from '../api/listChats';
import { ChatListItem } from './ChatListItem';

export function ChatList() {
  const router = useRouter();
  const chats = useListChats();

  useFocusEffect(
    React.useCallback(() => {
      void chats.refetch();
    }, [chats.refetch]),
  );

  if (chats.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingIndicator size={10} />
      </View>
    );
  }

  const items = chats.data ?? [];
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Message}
        title="no chats yet"
        subtitle="join an activity and you'll land in its group chat."
      />
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(c) => c.activityId}
      renderItem={({ item }) => (
        <ChatListItem
          preview={item}
          onPress={() =>
            router.push({
              pathname: '/chat/[id]',
              params: { id: item.activityId },
            })
          }
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={chats.isRefetching}
          onRefresh={() => void chats.refetch()}
        />
      }
    />
  );
}
