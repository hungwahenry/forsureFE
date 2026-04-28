import { setAuthHandlers } from '@/lib/api/client';
import {
  clearTokens,
  getTokens,
  setTokens,
  type StoredTokens,
} from '@/lib/auth/tokenStorage';
import { create } from 'zustand';

export type AuthStatus =
  | 'bootstrapping'
  | 'unauthenticated'
  | 'authenticated';

export interface AuthUser {
  id: string;
  email: string;
  onboardingCompletedAt: string | null;
}

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  onboardingRequired: boolean;

  /** Cold-start hydration: read SecureStore and decide initial status. */
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
    // Trust stored tokens optimistically. The 401-refresh interceptor will
    // recover from an expired access token; if refresh itself fails, the
    // signOut handler below clears state.
    set({ status: 'authenticated' });
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
