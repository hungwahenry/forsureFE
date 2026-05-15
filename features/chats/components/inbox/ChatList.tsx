import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { usePullRefresh } from '@/lib/hooks/usePullRefresh';
import { useFocusEffect, useRouter } from 'expo-router';
import { Message } from 'iconsax-react-nativejs';
import * as React from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useListChats } from '../../api/listChats';
import type { ChatPreview } from '../../types';
import { ChatListItem } from './ChatListItem';

type Segment = 'upcoming' | 'past';

function segmentItems(items: ChatPreview[], segment: Segment): ChatPreview[] {
  const filtered =
    segment === 'upcoming'
      ? items.filter((c) => c.status === 'OPEN')
      : items.filter((c) => c.status === 'DONE' || c.status === 'CANCELLED');

  return filtered.slice().sort((a, b) => {
    const ta = new Date(a.startsAt).getTime();
    const tb = new Date(b.startsAt).getTime();
    return segment === 'upcoming' ? ta - tb : tb - ta;
  });
}

export function ChatList() {
  const router = useRouter();
  const chats = useListChats();
  const refresh = usePullRefresh(chats.refetch);
  const [segment, setSegment] = React.useState<Segment>('upcoming');

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

  if (chats.isError && !chats.data) {
    return (
      <ErrorState
        title="couldn't load chats"
        onRetry={() => void chats.refetch()}
      />
    );
  }

  const all = chats.data ?? [];
  const items = segmentItems(all, segment);

  return (
    <View className="flex-1">
      <View className="flex-row gap-1 px-6 pb-3">
        {(['upcoming', 'past'] as Segment[]).map((s) => (
          <Pressable
            key={s}
            onPress={() => setSegment(s)}
            className={`rounded-full px-4 py-1.5 ${segment === s ? 'bg-primary' : 'bg-muted'}`}
          >
            <Text
              className={`text-sm font-semibold ${segment === s ? 'text-primary-foreground' : 'text-muted-foreground'}`}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon={Message}
          title={segment === 'upcoming' ? 'no upcoming chats' : 'no past chats'}
          subtitle={
            segment === 'upcoming'
              ? "join an activity and you'll land in its group chat."
              : 'completed and cancelled activities show up here.'
          }
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(c) => c.activityId}
          renderItem={({ item, index }) => (
            <ChatListItem
              preview={item}
              index={index}
              onPress={() =>
                router.push({
                  pathname: '/chat/[id]',
                  params: { id: item.activityId },
                })
              }
            />
          )}
          refreshControl={<RefreshControl {...refresh} />}
        />
      )}
    </View>
  );
}
