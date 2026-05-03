import type {
  NotificationChannel,
  NotificationEventCode,
} from '@/features/notifications/types';

export interface PreferenceEntry {
  eventCode: NotificationEventCode;
  channel: NotificationChannel;
  enabled: boolean;
}

export interface PreferencesResponse {
  entries: PreferenceEntry[];
}

export interface PreferenceUpdate {
  eventCode: NotificationEventCode;
  channel: NotificationChannel;
  enabled: boolean;
}
