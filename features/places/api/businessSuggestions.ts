import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { BusinessVenueSuggestion } from '../types';

interface BusinessSuggestionsArgs {
  q: string;
  proximity: { lat: number; lng: number } | null;
}

export function useBusinessSuggestions({
  q,
  proximity,
  enabled,
}: BusinessSuggestionsArgs & { enabled: boolean }) {
  const lat = proximity?.lat;
  const lng = proximity?.lng;
  return useQuery({
    queryKey: ['places', 'business-suggestions', q, lat, lng],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        lat: lat as number,
        lng: lng as number,
      };
      if (q) params.q = q;
      const res = await api.get<BusinessVenueSuggestion[]>(
        '/v1/places/business-suggestions',
        { params },
      );
      return res.data;
    },
    enabled: enabled && lat !== undefined && lng !== undefined,
    staleTime: 30_000,
    retry: false,
  });
}
