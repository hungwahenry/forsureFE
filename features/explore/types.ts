import type {
  ActivityPostAuthor,
  ActivityPostPhoto,
} from '@/features/posts/types';

export interface ExplorePostActivity {
  id: string;
  emoji: string;
  title: string;
  startsAt: string;
  placeName: string;
  hostUsername: string;
  participantCount: number;
  participantAvatarUrls: string[];
}

export interface ExplorePost {
  id: string;
  caption: string | null;
  createdAt: string;
  author: ActivityPostAuthor;
  photos: ActivityPostPhoto[];
  activity: ExplorePostActivity;
}

export interface ExplorePage {
  items: ExplorePost[];
  pageInfo: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface ExploreQueryParams {
  lat: number;
  lng: number;
  radiusKm?: number;
}
