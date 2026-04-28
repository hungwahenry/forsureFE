import { useAuthStore } from '@/features/auth/stores/authStore';
import { Redirect } from 'expo-router';

/**
 * Cold-start gate. RootLayout holds render until bootstrap finishes, so by
 * the time this component mounts the auth status is settled.
 */
export default function Index() {
  const status = useAuthStore((s) => s.status);
  const onboardingRequired = useAuthStore((s) => s.onboardingRequired);

  if (status === 'authenticated') {
    return <Redirect href={onboardingRequired ? '/onboarding' : '/home'} />;
  }
  return <Redirect href="/welcome" />;
}
