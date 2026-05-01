import { setAuthHandlers } from '@/lib/api/client';
import {
  disconnectChatsSocket,
  refreshChatsSocketAuth,
} from '@/lib/api/socket';
import {
  clearTokens,
  getTokens,
  setTokens,
  type StoredTokens,
} from '@/lib/auth/tokenStorage';
import { create } from 'zustand';
import { fetchMe } from '../api/me';
import type { AuthUser } from '../types';

export type AuthStatus =
  | 'bootstrapping'
  | 'unauthenticated'
  | 'authenticated';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  onboardingRequired: boolean;
  /** Reads SecureStore + verifies via GET /auth/me — catches stale/revoked sessions. */
  bootstrap: () => Promise<void>;
  signIn: (params: { user: AuthUser; tokens: StoredTokens }) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'bootstrapping',
  user: null,
  onboardingRequired: true,

  bootstrap: async () => {
    const tokens = await getTokens();
    if (!tokens) {
      set({
        status: 'unauthenticated',
        user: null,
        onboardingRequired: true,
      });
      return;
    }

    try {
      const { user, onboardingRequired } = await fetchMe();
      set({
        status: 'authenticated',
        user,
        onboardingRequired,
      });
    } catch {
      // Auth failure clears tokens via interceptor; network/server errors leave tokens for retry on next launch.
      set({
        status: 'unauthenticated',
        user: null,
        onboardingRequired: true,
      });
    }
  },

  signIn: async ({ user, tokens }) => {
    await setTokens(tokens);
    set({
      status: 'authenticated',
      user,
      onboardingRequired: !user.onboardingCompletedAt,
    });
  },

  signOut: async () => {
    disconnectChatsSocket();
    await clearTokens();
    set({
      status: 'unauthenticated',
      user: null,
      onboardingRequired: true,
    });
  },

  setUser: (user) =>
    set({ user, onboardingRequired: !user.onboardingCompletedAt }),
}));

// Side-effect: registers auth handlers on import. Root layout pulls this in before any HTTP request fires.
setAuthHandlers({
  getTokens,
  onTokensRefreshed: async (tokens) => {
    await setTokens(tokens);
    refreshChatsSocketAuth(tokens.accessToken);
  },
  onAuthFailed: () => useAuthStore.getState().signOut(),
});
