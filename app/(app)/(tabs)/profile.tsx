import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useMyProfile } from '@/features/users/api/getMyProfile';
import { UserProfileFeed } from '@/features/users/components/UserProfileFeed';
import { useRouter } from 'expo-router';
import { Setting2 } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useMyProfile();

  return (
    <Screen edges={['top']} noKeyboardAvoidance>
      <View className="flex-row items-center justify-end px-6 py-4">
        <Pressable
          onPress={() => router.push('/settings' as never)}
          hitSlop={8}
        >
          <Icon as={Setting2} className="text-muted-foreground size-7" />
        </Pressable>
      </View>

      {profile.isPending ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : !profile.data ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-center">
            couldn't load your profile.
          </Text>
        </View>
      ) : (
        <UserProfileFeed profile={profile.data} />
      )}
    </Screen>
  );
}
