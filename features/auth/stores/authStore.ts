import { setAuthHandlers } from '@/lib/api/client';
import { ApiError, ErrorCode } from '@/lib/api/types';
import { disconnectAppSocket, refreshAppSocketAuth } from '@/lib/api/socket';
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

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { user, onboardingRequired } = await fetchMe();
        set({ status: 'authenticated', user, onboardingRequired });
        return;
      } catch (err) {
        const transient =
          err instanceof ApiError &&
          (err.code === ErrorCode.NETWORK_ERROR ||
            err.code === ErrorCode.TIMEOUT);
        if (!transient || attempt === 2) {
          set({
            status: 'unauthenticated',
            user: null,
            onboardingRequired: true,
          });
          return;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, 600 * (attempt + 1)),
        );
      }
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
    disconnectAppSocket();
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
    refreshAppSocketAuth(tokens.accessToken);
  },
  onAuthFailed: () => useAuthStore.getState().signOut(),
});
