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
import { useUserProfile } from '@/features/users/api/getUserProfile';
import { UserProfileFeed } from '@/features/users/components/UserProfileFeed';
import { isMyProfile } from '@/features/users/types';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Flag, More } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export default function UserProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ username: string }>();
  const username = params.username ?? '';

  const profile = useUserProfile(username);

  if (profile.data && isMyProfile(profile.data)) {
    return <Redirect href="/profile" />;
  }

  const goReport = () =>
    router.push({
      pathname: '/report',
      params: { targetType: 'USER', targetId: profile.data?.id ?? '' },
    });

  const headerActions = profile.data ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Pressable hitSlop={8}>
          <Icon as={More} className="text-muted-foreground size-7" />
        </Pressable>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onPress={goReport}>
          <Icon as={Flag} className="size-4" />
          <Text>report</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  return (
    <Screen edges={['top']}>
      <Header onBack={() => router.back()} right={headerActions} />
      {profile.isPending ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : !profile.data ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-center">
            couldn't load this profile.
          </Text>
        </View>
      ) : (
        <UserProfileFeed profile={profile.data} />
      )}
    </Screen>
  );
}

function Header({
  onBack,
  right,
}: {
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <Pressable onPress={onBack} hitSlop={8}>
        <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
      </Pressable>
      {right ?? <View className="size-7" />}
    </View>
  );
}
