import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useListChats } from '@/features/chats/api/listChats';
import { ChatRoom } from '@/features/chats/components/ChatRoom';
import { useAutoRedirectIfChatRemoved } from '@/features/chats/hooks/useAutoRedirectIfChatRemoved';
import { formatRelativeDateTime } from '@/lib/format';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Video } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export default function ChatDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const activityId = params.id;
  const viewerUserId = useAuthStore((s) => s.user?.id ?? '');
  const chats = useListChats(!!viewerUserId);

  const preview = React.useMemo(
    () => chats.data?.find((c) => c.activityId === activityId) ?? null,
    [chats.data, activityId],
  );

  useAutoRedirectIfChatRemoved(preview, chats.isFetched);

  const openDetails = () =>
    router.push(`/chat/${activityId}/details` as never);

  return (
    <Screen edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Pressable
          onPress={preview ? openDetails : undefined}
          hitSlop={6}
          className="flex-1"
        >
          {preview ? (
            <>
              <Text
                className="text-foreground text-center text-base font-semibold"
                numberOfLines={1}
              >
                {preview.emoji} {preview.title}
              </Text>
              <Text
                className="text-muted-foreground text-center text-xs"
                numberOfLines={1}
              >
                {formatRelativeDateTime(new Date(preview.startsAt))} ·{' '}
                {preview.placeName}
              </Text>
            </>
          ) : (
            <Text
              className="text-foreground text-center text-base font-semibold"
              numberOfLines={1}
            >
              chat
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => router.push(`/call/${activityId}` as never)}
          hitSlop={8}
          className="size-7 items-center justify-center"
        >
          <Icon as={Video} className="text-muted-foreground size-7" />
        </Pressable>
      </View>

      {preview && viewerUserId ? (
        <ChatRoom
          activityId={activityId}
          viewerUserId={viewerUserId}
          hostUserId={preview.hostUserId}
          status={preview.status}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      )}
    </Screen>
  );
}
