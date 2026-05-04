import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

interface RequestExportResponse {
  requestId: string;
  status: 'PENDING' | 'COMPLETED';
}

export function useRequestDataExport() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<RequestExportResponse>(
        '/v1/account/export/request',
      );
      return res.data;
    },
  });
}
