import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { useBlockUser } from '@/features/blocks/api/blocks';
import { useUserProfile } from '@/features/users/api/getUserProfile';
import { UserProfileFeed } from '@/features/users/components/UserProfileFeed';
import { isMyProfile } from '@/features/users/types';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Flag, More, UserMinus } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export default function UserProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ username: string }>();
  const username = params.username ?? '';
  const profile = useUserProfile(username);
  const blockUser = useBlockUser();
  const [confirmBlock, setConfirmBlock] = React.useState(false);

  if (profile.data && isMyProfile(profile.data)) {
    return <Redirect href="/profile" />;
  }

  const goReport = () =>
    router.push({
      pathname: '/report',
      params: { targetType: 'USER', targetId: profile.data?.id ?? '' },
    });

  const onConfirmBlock = async () => {
    if (!profile.data) return;
    const target = profile.data;
    setConfirmBlock(false);
    try {
      await blockUser.mutateAsync(target.id);
      toast.success(`@${target.username} blocked.`);
      router.back();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't block. try again.";
      toast.error(message);
    }
  };

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
        <DropdownMenuItem
          variant="destructive"
          onPress={() => setConfirmBlock(true)}
        >
          <Icon as={UserMinus} className="size-4" />
          <Text>block</Text>
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

      <AlertDialog
        open={confirmBlock}
        onOpenChange={(open) => {
          if (!open) setConfirmBlock(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              block @{profile.data?.username}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              they won't see your profile or be able to message you, and their
              activities won't show up for you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>nevermind</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={() => void onConfirmBlock()}>
              <Text>block</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
