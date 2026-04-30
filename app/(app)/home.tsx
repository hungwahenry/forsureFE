import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { haptics } from '@/lib/haptics';
import { useRouter } from 'expo-router';
import { Add } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { signOut, isPending } = useSignOut();

  const openCreate = () => {
    haptics.press();
    router.push('/create-activity');
  };

  return (
    <Screen noKeyboardAvoidance>
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

      <Pressable
        onPress={openCreate}
        className="bg-primary absolute bottom-8 right-6 size-16 items-center justify-center rounded-full shadow-lg shadow-black/20"
        accessibilityRole="button"
        accessibilityLabel="Create activity"
      >
        <Icon as={Add} className="text-primary-foreground size-8" />
      </Pressable>
    </Screen>
  );
}
