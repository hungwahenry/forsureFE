import { Lightbox } from '@/components/ui/lightbox';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useNotificationResponse } from '@/features/notifications/hooks/useNotificationResponse';
import { useRegisterPushToken } from '@/features/notifications/hooks/useRegisterPushToken';
import { useAppRealtime } from '@/features/realtime/useAppRealtime';
import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
  const status = useAuthStore((s) => s.status);
  const onboardingRequired = useAuthStore((s) => s.onboardingRequired);
  const ready = status === 'authenticated' && !onboardingRequired;
  useAppRealtime();
  useRegisterPushToken(ready);
  useNotificationResponse(ready);

  if (status !== 'authenticated') return <Redirect href="/welcome" />;
  if (onboardingRequired) return <Redirect href="/onboarding" />;

  return (
    <>
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
        <Stack.Screen
          name="post"
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="notification-preferences"
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="settings"
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="blocked-users"
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="delete-account"
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack>
      <Lightbox />
    </>
  );
}
