import { useLogout } from '../api/logout';
import { useAuthStore } from '../stores/authStore';

// Server revoke is best-effort; local sign-out always proceeds.
export function useSignOut() {
  const logout = useLogout();
  const signOut = useAuthStore((s) => s.signOut);

  const performSignOut = async (): Promise<void> => {
    try {
      await logout.mutateAsync();
    } catch {
      // Local sign-out is what matters.
    }
    await signOut();
  };

  return {
    signOut: performSignOut,
    isPending: logout.isPending,
  };
}
