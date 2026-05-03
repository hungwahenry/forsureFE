import type { NotificationRoutePayload } from '@/features/notifications/route';
import type { NotificationEventCode } from '@/features/notifications/types';

export interface NotificationItem {
  id: string;
  eventCode: NotificationEventCode | string;
  title: string;
  body: string;
  data: NotificationRoutePayload & Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export interface InboxPage {
  items: NotificationItem[];
  pageInfo: { nextCursor: string | null; hasMore: boolean };
}

export interface UnreadCountResponse {
  count: number;
}
