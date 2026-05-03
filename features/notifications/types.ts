export type DevicePlatform = 'IOS' | 'ANDROID' | 'WEB';

export type NotificationChannel = 'PUSH' | 'EMAIL';

export type NotificationEventCode =
  | 'CHAT_MESSAGE'
  | 'REPLY'
  | 'JOIN'
  | 'LEAVE'
  | 'CANCELLATION'
  | 'PINNED'
  | 'NEW_MEMORY'
  | 'ACTIVITY_START_1H';
