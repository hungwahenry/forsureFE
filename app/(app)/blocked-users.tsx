import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useBlockedUsers, useUnblockUser } from '@/features/blocks/api/blocks';
import type { BlockedUser } from '@/features/blocks/types';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserMinus } from 'iconsax-react-nativejs';
import { FlatList, Pressable, View } from 'react-native';

export default function BlockedUsersScreen() {
  const router = useRouter();
  const blocked = useBlockedUsers();
  const unblock = useUnblockUser();

  const onUnblock = async (user: BlockedUser) => {
    try {
      await unblock.mutateAsync(user.id);
      toast.success(`unblocked @${user.username}.`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't unblock. try again.";
      toast.error(message);
    }
  };

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          blocked users
        </Text>
        <View className="size-7" />
      </View>

      {blocked.isPending ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : !blocked.data || blocked.data.length === 0 ? (
        <EmptyState
          icon={UserMinus}
          title="no one blocked"
          subtitle="people you block will show up here."
        />
      ) : (
        <FlatList
          data={blocked.data}
          keyExtractor={(u) => u.id}
          renderItem={({ item }) => (
            <View className="border-border/40 flex-row items-center gap-3 border-b px-6 py-3">
              <Image
                source={{ uri: item.avatarUrl }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                className="bg-muted"
              />
              <View className="flex-1">
                <Text
                  className="text-foreground text-base font-semibold"
                  numberOfLines={1}
                >
                  {item.displayName}
                </Text>
                <Text
                  className="text-muted-foreground text-sm"
                  numberOfLines={1}
                >
                  @{item.username}
                </Text>
              </View>
              <Pressable
                onPress={() => void onUnblock(item)}
                hitSlop={6}
                disabled={unblock.isPending}
              >
                <Text className="text-primary text-sm font-semibold">
                  unblock
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </Screen>
  );
}
