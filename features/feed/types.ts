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

/** Mirrors backend FeedService FeedItem. */
export interface FeedItem {
  id: string;
  emoji: string;
  title: string;
  /** ISO datetime string. */
  startsAt: string;
  place: FeedItemPlace;
  capacity: number;
  spotsLeft: number;
  distanceKm: number;
  host: FeedHost;
  isOwn: boolean;
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
  /** Defaults to 25km server-side; max 100. */
  radiusKm?: number;
}
