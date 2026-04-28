import { Redirect } from 'expo-router';

/**
 * Entry into the onboarding flow — redirects to the first step.
 * The auth + onboarding-required guard lives in `_layout.tsx`.
 */
export default function OnboardingIndex() {
  return <Redirect href="/onboarding/username" />;
}
