import { api } from '@/lib/api/client';
import { getTokens } from '@/lib/auth/tokenStorage';
import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  return useMutation<void, unknown, void>({
    mutationFn: async () => {
      const tokens = await getTokens();
      // Even if no refresh token (somehow), call the endpoint with empty body
      // and let the server reject — we'll still clear local state in the caller.
      if (!tokens?.refreshToken) return;
      await api.post('/v1/auth/logout', {
        refreshToken: tokens.refreshToken,
      });
    },
  });
}
