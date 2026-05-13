import { useAuthStore } from '@/features/auth/stores/authStore';
import { useFeatureFlagsQuery } from '../api/getFeatureFlags';

/** Renders nothing — exists so the feature-flags query is mounted at the
 *  app root and stays warm while the user is authenticated. */
export function FeatureFlagsBootstrapper() {
  const status = useAuthStore((s) => s.status);
  useFeatureFlagsQuery({ enabled: status === 'authenticated' });
  return null;
}
