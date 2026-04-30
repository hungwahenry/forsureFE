export type ActivityStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'DONE';
export type ActivityGenderPreference = 'ALL' | 'MALE' | 'FEMALE';

/** Mirrors backend's Activity row. */
export interface Activity {
  id: string;
  authorUserId: string;
  emoji: string;
  title: string;
  startsAt: string;
  placeName: string;
  placeLat: number;
  placeLng: number;
  capacity: number;
  genderPreference: ActivityGenderPreference;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
}

/** Body of POST /v1/activities. */
export interface CreateActivityPayload {
  emoji: string;
  title: string;
  /** ISO datetime string. */
  startsAt: string;
  placeName: string;
  placeLat: number;
  placeLng: number;
  capacity: number;
  genderPreference: ActivityGenderPreference;
}
