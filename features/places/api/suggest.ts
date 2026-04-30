import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { PlaceSuggestion } from '../types';

interface SuggestArgs {
  q: string;
  proximity?: { lat: number; lng: number };
  sessionToken: string;
}

// Caller debounces — this fires on every arg change.
export function useSuggestPlaces({
  q,
  proximity,
  sessionToken,
  enabled,
}: SuggestArgs & { enabled: boolean }) {
  return useQuery({
    queryKey: ['places', 'suggest', q, proximity?.lat, proximity?.lng, sessionToken],
    queryFn: async () => {
      const params: Record<string, string | number> = { q, sessionToken };
      if (proximity) {
        params.lat = proximity.lat;
        params.lng = proximity.lng;
      }
      const res = await api.get<PlaceSuggestion[]>('/v1/places/suggest', {
        params,
      });
      return res.data;
    },
    enabled,
    staleTime: 30_000,
    retry: false,
  });
}
