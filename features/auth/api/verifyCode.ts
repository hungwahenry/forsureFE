import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { VerifyCodeResponse } from '../types';

interface VerifyCodeArgs {
  email: string;
  code: string;
}

export function useVerifyCode() {
  return useMutation<VerifyCodeResponse, unknown, VerifyCodeArgs>({
    mutationFn: async ({ email, code }) => {
      const res = await api.post<VerifyCodeResponse>(
        '/v1/auth/verify-code',
        { email, code },
      );
      return res.data;
    },
  });
}
