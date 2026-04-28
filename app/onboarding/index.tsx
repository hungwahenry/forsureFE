import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLogout } from '@/features/auth/api/logout';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Stub onboarding entry — gets replaced when we build the onboarding
 * feature (username, display name, dob, photo, gender, location).
 */
export default function OnboardingStub() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const logout = useLogout();

  const onLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : null;
      if (message) toast.warning(message);
    }
    await signOut();
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center gap-6 p-6">
        <Text className="text-foreground text-3xl font-bold">
          let's set up your profile
        </Text>
        <Text className="text-muted-foreground text-center">
          (stub — username, photo, gender, location collection lives here)
        </Text>
        {user ? (
          <Text className="text-muted-foreground text-sm">
            signed in as {user.email}
          </Text>
        ) : null}
        <Button
          onPress={onLogout}
          variant="outline"
          disabled={logout.isPending}
        >
          <Text>{logout.isPending ? 'logging out...' : 'log out'}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
