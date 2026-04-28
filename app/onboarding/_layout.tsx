import { useAuthStore } from '@/features/auth/stores/authStore';
import { Redirect, Stack } from 'expo-router';

/**
 * Onboarding section. Only reachable for authenticated users who haven't
 * completed their profile yet.
 */
export default function OnboardingLayout() {
  const status = useAuthStore((s) => s.status);
  const onboardingRequired = useAuthStore((s) => s.onboardingRequired);

  if (status !== 'authenticated') return <Redirect href="/welcome" />;
  if (!onboardingRequired) return <Redirect href="/home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
