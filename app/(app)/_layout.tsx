import { useAuthStore } from '@/features/auth/stores/authStore';
import { useAppRealtime } from '@/features/realtime/useAppRealtime';
import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
  const status = useAuthStore((s) => s.status);
  const onboardingRequired = useAuthStore((s) => s.onboardingRequired);
  useAppRealtime();

  if (status !== 'authenticated') return <Redirect href="/welcome" />;
  if (onboardingRequired) return <Redirect href="/onboarding" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="create-activity"
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="place-picker"
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="place-view"
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="report"
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen name="chat/[id]" />
    </Stack>
  );
}
