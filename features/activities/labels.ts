import type { ActivityGenderPreference, ActivityStatus } from './types';

/** Brand-voice copy for activity gender preferences. */
export const GENDER_LABEL: Record<ActivityGenderPreference, string> = {
  ALL: 'people',
  FEMALE: 'girls',
  MALE: 'guys',
};

/** Sentence verb keyed off activity status. Past tense once ended/cancelled. */
export const ACTIVITY_VERB: Record<ActivityStatus, 'wants to' | 'wanted to'> = {
  OPEN: 'wants to',
  FULL: 'wants to',
  CANCELLED: 'wanted to',
  DONE: 'wanted to',
};
