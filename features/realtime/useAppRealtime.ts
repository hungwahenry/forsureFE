import { useAuthStore } from '@/features/auth/stores/authStore';
import { registerChatRealtime } from '@/features/chats/realtime/chatsRealtime';
import { getAppSocket } from '@/lib/api/socket';
import { getTokens } from '@/lib/auth/tokenStorage';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

/**
 * One hook, mounted once at the root app layout. Owns the lifecycle of the
 * app's single socket connection and registers every feature's realtime
 * handlers against it. Adding a new feature = one more registration call.
 */
export function useAppRealtime(): void {
  const status = useAuthStore((s) => s.status);
  const qc = useQueryClient();

  React.useEffect(() => {
    if (status !== 'authenticated') return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    void (async () => {
      const tokens = await getTokens();
      if (!tokens || cancelled) return;
      const socket = getAppSocket({ accessToken: tokens.accessToken });
      cleanup = registerChatRealtime(socket, qc);
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [status, qc]);
}
