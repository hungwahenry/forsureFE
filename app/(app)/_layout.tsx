import { useAuthStore } from '@/features/auth/stores/authStore';
import { Redirect, Stack } from 'expo-router';

/**
 * Authenticated section. Bounces unauthenticated users to /welcome and
 * onboarding-incomplete users to /onboarding.
 */
export default function AppLayout() {
  const status = useAuthStore((s) => s.status);
  const onboardingRequired = useAuthStore((s) => s.onboardingRequired);

  if (status !== 'authenticated') return <Redirect href="/welcome" />;
  if (onboardingRequired) return <Redirect href="/onboarding" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
