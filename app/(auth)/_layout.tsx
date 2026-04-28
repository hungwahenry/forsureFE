import { useAuthStore } from '@/features/auth/stores/authStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const status = useAuthStore((s) => s.status);
  const onboardingRequired = useAuthStore((s) => s.onboardingRequired);

  // Already signed in — bounce to the right destination.
  if (status === 'authenticated') {
    return <Redirect href={onboardingRequired ? '/onboarding' : '/home'} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    />
  );
}
