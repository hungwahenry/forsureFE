export type FeatureFlagKey =
  | 'signup_enabled'
  | 'activity_joining_enabled'
  | 'activity_chat_enabled'
  | 'public_memories_sharing_enabled'
  | 'easter_eggs_enabled'
  | 'business_venue_suggestions_enabled'
  | 'business_boosts_enabled';

export interface FeatureFlagsResponse {
  flags: Partial<Record<FeatureFlagKey, boolean>>;
}
