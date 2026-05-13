import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

export function useRecordVenuePick() {
  return useMutation<void, unknown, { venueId: string }>({
    mutationFn: async ({ venueId }) => {
      await api.post(
        `/v1/places/business-suggestions/${encodeURIComponent(venueId)}/pick`,
      );
    },
  });
}
