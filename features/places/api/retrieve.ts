import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { PlaceDetails } from '../types';

interface RetrieveArgs {
  id: string;
  sessionToken: string;
}

// `sessionToken` must match the one sent with preceding suggest calls (single billable session).
export function useRetrievePlace() {
  return useMutation<PlaceDetails, unknown, RetrieveArgs>({
    mutationFn: async ({ id, sessionToken }) => {
      const res = await api.get<PlaceDetails>(
        `/v1/places/retrieve/${encodeURIComponent(id)}`,
        { params: { sessionToken } },
      );
      return res.data;
    },
  });
}
