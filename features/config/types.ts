export type ClientConfigKey =
  | 'activity.min_lead_time_minutes'
  | 'onboarding.min_age_years'
  | 'venue.photo_max'
  | 'account.export_download_ttl_hours';

export type ClientConfigValue = number | boolean | string;

export interface ClientConfigResponse {
  config: Partial<Record<ClientConfigKey, ClientConfigValue>>;
}
