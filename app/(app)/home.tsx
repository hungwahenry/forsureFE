import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Stub home — gets replaced when we build the activities feature.
 * Confirms the round-trip: signed in, /me populated, logout works.
 */
export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { signOut, isPending } = useSignOut();

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center gap-6 p-6">
        <Text className="text-foreground text-3xl font-bold">home</Text>
        <Text className="text-muted-foreground">
          (stub — activities feed lives here)
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
    </SafeAreaView>
  );
}
