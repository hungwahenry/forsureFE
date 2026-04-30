import { useAuthStore } from '@/features/auth/stores/authStore';
import { Redirect } from 'expo-router';

// Auth status is settled by the time this mounts — RootLayout holds render until bootstrap resolves.
export default function Index() {
  const status = useAuthStore((s) => s.status);
  const onboardingRequired = useAuthStore((s) => s.onboardingRequired);

  if (status === 'authenticated') {
    return <Redirect href={onboardingRequired ? '/onboarding' : '/home'} />;
  }
  return <Redirect href="/welcome" />;
}
