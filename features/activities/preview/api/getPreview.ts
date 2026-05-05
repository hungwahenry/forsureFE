import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { ActivityGenderPreference, ActivityStatus } from '../../types';

export interface ActivityPreviewHost {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export interface ActivityPreview {
  id: string;
  emoji: string;
  title: string;
  startsAt: string;
  place: { name: string; lat: number; lng: number };
  capacity: number;
  participantCount: number;
  genderPreference: ActivityGenderPreference;
  status: ActivityStatus;
  spotsLeft: number;
  host: ActivityPreviewHost;
  participantAvatarUrls: string[];
  viewerIsHost: boolean;
  viewerIsMember: boolean;
}

export const activityPreviewQueryKey = (activityId: string) =>
  ['activities', activityId, 'preview'] as const;

export function useActivityPreview(activityId: string) {
  return useQuery({
    queryKey: activityPreviewQueryKey(activityId),
    queryFn: async () => {
      const res = await api.get<ActivityPreview>(
        `/v1/activities/${activityId}/preview`,
      );
      return res.data;
    },
  });
}
