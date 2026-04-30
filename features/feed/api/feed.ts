import { api } from '@/lib/api/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { FeedPage, FeedQueryParams } from '../types';

interface UseFeedArgs extends FeedQueryParams {
  /** Disable until device location is available. */
  enabled?: boolean;
}

export function useFeed({ lat, lng, radiusKm, enabled = true }: UseFeedArgs) {
  return useInfiniteQuery({
    queryKey: ['feed', { lat, lng, radiusKm }] as const,
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string | number> = { lat, lng };
      if (radiusKm !== undefined) params.radiusKm = radiusKm;
      if (pageParam) params.cursor = pageParam;
      const res = await api.get<FeedPage>('/v1/feed', { params });
      return res.data;
    },
    getNextPageParam: (last) => last.pageInfo.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled,
  });
}
