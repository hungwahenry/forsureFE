import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useListChats } from '@/features/chats/api/listChats';
import { ChatRoom } from '@/features/chats/components/ChatRoom';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
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

  const everFound = React.useRef(false);
  React.useEffect(() => {
    if (preview) everFound.current = true;
    if (!preview && everFound.current && chats.isFetched) {
      router.back();
    }
  }, [preview, chats.isFetched, router]);

  return (
    <Screen edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text
          className="text-foreground flex-1 text-center text-base font-semibold"
          numberOfLines={1}
        >
          {preview ? `${preview.emoji}  ${preview.title}` : 'chat'}
        </Text>
        <View className="size-7" />
      </View>

      {preview && viewerUserId ? (
        <ChatRoom
          activityId={activityId}
          viewerUserId={viewerUserId}
          hostUserId={preview.hostUserId}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      )}
    </Screen>
  );
}
