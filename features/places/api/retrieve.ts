import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { PlaceDetails } from '../types';

interface RetrieveArgs {
  id: string;
  sessionToken: string;
}

/**
 * Closes the place-search session. Use the SAME sessionToken that was sent
 * with the preceding suggest calls so the provider bills the whole
 * interaction as one billable session unit.
 */
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
