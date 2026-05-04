import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

interface DeleteAccountArgs {
  challengeId: string;
  code: string;
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async ({ challengeId, code }: DeleteAccountArgs) => {
      await api.post('/v1/account/delete', { challengeId, code });
    },
  });
}
