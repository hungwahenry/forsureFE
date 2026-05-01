import { api } from '@/lib/api/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { ExplorePage, ExploreQueryParams } from '../types';

interface UseExplorePostsArgs extends ExploreQueryParams {
  /** Disable until device location is available. */
  enabled?: boolean;
}

export function useExplorePosts({
  lat,
  lng,
  radiusKm,
  enabled = true,
}: UseExplorePostsArgs) {
  return useInfiniteQuery({
    queryKey: ['explore', 'posts', { lat, lng, radiusKm }] as const,
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string | number> = { lat, lng };
      if (radiusKm !== undefined) params.radiusKm = radiusKm;
      if (pageParam) params.cursor = pageParam;
      const res = await api.get<ExplorePage>('/v1/explore/posts', { params });
      return res.data;
    },
    getNextPageParam: (last) => last.pageInfo.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled,
  });
}
