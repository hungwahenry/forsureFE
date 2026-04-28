import { useLogout } from '../api/logout';
import { useAuthStore } from '../stores/authStore';

/**
 * Signs the user out. Server-side refresh-token revoke is best-effort —
 * a failure (network down, token already expired) doesn't block the local
 * sign-out: clearing tokens + flipping the store always happens.
 */
export function useSignOut() {
  const logout = useLogout();
  const signOut = useAuthStore((s) => s.signOut);

  const performSignOut = async (): Promise<void> => {
    try {
      await logout.mutateAsync();
    } catch {
      // Intentionally swallow — local sign-out is what matters.
    }
    await signOut();
  };

  return {
    signOut: performSignOut,
    isPending: logout.isPending,
  };
}
