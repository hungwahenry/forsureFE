import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useMyProfile } from '@/features/users/api/getMyProfile';
import { UserProfileFeed } from '@/features/users/components/UserProfileFeed';
import { toast } from '@/lib/toast';
import { Edit2, Logout, Setting2 } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function ProfileScreen() {
  const profile = useMyProfile();
  const { signOut, isPending: signingOut } = useSignOut();

  return (
    <Screen edges={['top']} noKeyboardAvoidance>
      <View className="flex-row items-center justify-end px-6 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Pressable hitSlop={8}>
              <Icon
                as={Setting2}
                className="text-muted-foreground size-7"
              />
            </Pressable>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onPress={() => toast('coming soon')}>
              <Icon as={Edit2} className="size-4" />
              <Text>edit profile</Text>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onPress={() => void signOut()}
              disabled={signingOut}
            >
              <Icon as={Logout} className="size-4" />
              <Text>sign out</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
