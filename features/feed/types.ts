export interface FeedHost {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export interface FeedItemPlace {
  name: string;
  lat: number;
  lng: number;
}

export interface FeedItemBoost {
  businessId: string;
  businessName: string;
  businessLogoUrl: string | null;
}

export interface FeedItem {
  id: string;
  emoji: string;
  title: string;
  startsAt: string;
  place: FeedItemPlace;
  capacity: number;
  genderPreference: 'ALL' | 'MALE' | 'FEMALE';
  spotsLeft: number;
  distanceKm: number;
  host: FeedHost;
  participantAvatarUrls: string[];
  goingCount: number;
  boost: FeedItemBoost | null;
}

export interface FeedPageInfo {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface FeedPage {
  items: FeedItem[];
  pageInfo: FeedPageInfo;
}

export interface FeedQueryParams {
  lat: number;
  lng: number;
  radiusKm?: number;
}
