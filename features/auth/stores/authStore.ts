import { setAuthHandlers } from '@/lib/api/client';
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

  /**
   * Cold-start hydration. Reads SecureStore, then *always* verifies with
   * the server via GET /auth/me before reporting `authenticated`. Stale or
   * revoked sessions are caught here.
   */
  bootstrap: () => Promise<void>;
  /** Called by the auth feature after a successful verify-code. */
  signIn: (params: { user: AuthUser; tokens: StoredTokens }) => Promise<void>;
  /** Called by the auth feature on logout, or by the API client on auth failure. */
  signOut: () => Promise<void>;
  /** Update the cached user (e.g. after onboarding completes). */
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
      // Auth failures: the interceptor's onAuthFailed already cleared tokens
      // and flipped to unauthenticated. Network/server errors leave tokens in
      // place so a future launch can recover. Either way, this launch is
      // unauthenticated.
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

// Wire the API client's auth handlers. This module must be imported once
// during app boot (root layout pulls it in) so these handlers are registered
// before any HTTP request is made.
setAuthHandlers({
  getTokens,
  onTokensRefreshed: setTokens,
  onAuthFailed: () => useAuthStore.getState().signOut(),
});
