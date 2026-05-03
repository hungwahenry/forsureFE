import type { AuthUser } from '@/features/auth/types';
import type { Gender } from '@/features/users/types';

export interface LocationCoords {
  lat: number;
  lng: number;
  placeName: string;
}

export interface AvatarUploadResponse {
  key: string;
  url: string;
}

export interface CompleteOnboardingPayload {
  username: string;
  displayName: string;
  /** ISO date string — backend uses class-transformer @Type(() => Date). */
  dateOfBirth: string;
  gender: Gender;
  avatarKey: string;
  location: LocationCoords;
}

export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  dateOfBirth: string;
  gender: Gender;
  avatarKey: string;
  locationLat: number;
  locationLng: number;
  placeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompleteOnboardingResponse {
  user: AuthUser;
  profile: Profile;
  accessToken: string;
  accessTokenExpiresAt: string;
}
