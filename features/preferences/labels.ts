import type { NotificationEventCode } from '@/features/notifications/types';

export const NOTIFICATION_EVENT_LABEL: Record<NotificationEventCode, string> = {
  CHAT_MESSAGE: 'chat messages',
  REPLY: 'replies to you',
  JOIN: 'someone joins your activity',
  LEAVE: 'someone leaves',
  CANCELLATION: 'activity cancelled',
  PINNED: 'pinned messages',
  NEW_MEMORY: 'new memories shared',
  ACTIVITY_START_1H: 'starting in ~1 hour',
};

/** Render order for the preferences UI. */
export const NOTIFICATION_EVENT_ORDER: NotificationEventCode[] = [
  'CHAT_MESSAGE',
  'REPLY',
  'JOIN',
  'LEAVE',
  'CANCELLATION',
  'PINNED',
  'NEW_MEMORY',
  'ACTIVITY_START_1H',
];

/**
 * Events whose handlers actually send email. Hide email toggles for any event
 * not in this set — toggling them on would do nothing since no email path
 * exists. Mirrors the backend's per-handler `email:` spec.
 */
export const EMAILABLE_EVENTS: NotificationEventCode[] = ['ACTIVITY_START_1H'];
