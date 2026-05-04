import { myProfileQueryKey } from '@/features/users/api/getMyProfile';
import type { MyProfile } from '@/features/users/types';
import { api } from '@/lib/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface StartResponse {
  challengeId: string;
  ttlMinutes: number;
}

export function useStartEmailChange() {
  return useMutation({
    mutationFn: async (newEmail: string) => {
      const res = await api.post<StartResponse>('/v1/account/email/start', {
        newEmail,
      });
      return res.data;
    },
  });
}

interface ConfirmArgs {
  challengeId: string;
  code: string;
}

export function useConfirmEmailChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ challengeId, code }: ConfirmArgs) => {
      const res = await api.post<MyProfile>('/v1/account/email/confirm', {
        challengeId,
        code,
      });
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(myProfileQueryKey(), data);
    },
  });
}
