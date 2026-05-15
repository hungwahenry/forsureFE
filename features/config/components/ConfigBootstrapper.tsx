import { useAuthStore } from '@/features/auth/stores/authStore';
import { useConfigQuery } from '../api/getConfig';

/** Renders nothing — exists so the client-config query is mounted at the
 *  app root and stays warm while the user is authenticated. */
export function ConfigBootstrapper() {
  const status = useAuthStore((s) => s.status);
  useConfigQuery({ enabled: status === 'authenticated' });
  return null;
}
