import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CreateActivitySheet } from '@/features/activities/components/CreateActivitySheet';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { haptics } from '@/lib/haptics';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { Add } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { signOut, isPending } = useSignOut();
  const createSheetRef = React.useRef<BottomSheetModal>(null);

  const openCreate = () => {
    haptics.press();
    createSheetRef.current?.present();
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center gap-6 p-6">
        <Text className="text-foreground text-3xl font-bold">home</Text>
        <Text className="text-muted-foreground">
          (stub — feed lives here next sprint)
        </Text>
        {user ? (
          <Text className="text-muted-foreground text-sm">
            signed in as {user.email}
          </Text>
        ) : null}
        <Button onPress={signOut} variant="outline" disabled={isPending}>
          <Text>{isPending ? 'logging out...' : 'log out'}</Text>
        </Button>
      </View>

      {/* Floating + button, opens the mad-libs create sheet */}
      <Pressable
        onPress={openCreate}
        className="bg-primary absolute bottom-8 right-6 size-16 items-center justify-center rounded-full shadow-lg shadow-black/20"
        accessibilityRole="button"
        accessibilityLabel="Create activity"
      >
        <Icon as={Add} className="text-primary-foreground size-8" />
      </Pressable>

      <CreateActivitySheet ref={createSheetRef} />
    </SafeAreaView>
  );
}
