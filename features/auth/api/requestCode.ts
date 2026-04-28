import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { RequestCodeResponse } from '../types';

interface RequestCodeArgs {
  email: string;
}

export function useRequestCode() {
  return useMutation<RequestCodeResponse, unknown, RequestCodeArgs>({
    mutationFn: async ({ email }) => {
      const res = await api.post<RequestCodeResponse>(
        '/v1/auth/request-code',
        { email },
      );
      return res.data;
    },
  });
}
