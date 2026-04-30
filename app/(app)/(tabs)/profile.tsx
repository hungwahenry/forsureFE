import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { View } from 'react-native';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const { signOut, isPending } = useSignOut();

  return (
    <Screen edges={['top']} noKeyboardAvoidance>
      <View className="flex-1 items-center justify-center gap-6 p-6">
        <Text className="text-foreground text-3xl font-bold">profile</Text>
        {user ? (
          <Text className="text-muted-foreground text-sm">
            signed in as {user.email}
          </Text>
        ) : null}
        <Button onPress={signOut} variant="outline" disabled={isPending}>
          <Text>{isPending ? 'logging out...' : 'log out'}</Text>
        </Button>
      </View>
    </Screen>
  );
}
