import { api } from '@/lib/api/client';
import { getTokens } from '@/lib/auth/tokenStorage';
import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  return useMutation<void, unknown, void>({
    mutationFn: async () => {
      const tokens = await getTokens();
      if (!tokens?.refreshToken) return;
      await api.post('/v1/auth/logout', {
        refreshToken: tokens.refreshToken,
      });
    },
  });
}
