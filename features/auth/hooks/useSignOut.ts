import { unregisterDevice } from '@/features/notifications/api/devices';
import {
  clearStoredPushToken,
  getStoredPushToken,
} from '@/features/notifications/storage';
import { useLogout } from '../api/logout';
import { useAuthStore } from '../stores/authStore';

// Server revoke + push-token cleanup are best-effort; local sign-out always proceeds.
export function useSignOut() {
  const logout = useLogout();
  const signOut = useAuthStore((s) => s.signOut);

  const performSignOut = async (): Promise<void> => {
    const pushToken = await getStoredPushToken().catch(() => null);
    if (pushToken) {
      await unregisterDevice(pushToken).catch(() => {
        // If the call fails offline, the backend cleans up via DeviceNotRegistered
        // on the next push send, and the next user on this device overwrites the row.
      });
      await clearStoredPushToken().catch(() => undefined);
    }
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
