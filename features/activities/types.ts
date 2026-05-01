import type { ChatMessage } from '../chats/types';

export type ActivityStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'DONE';
export type ActivityGenderPreference = 'ALL' | 'MALE' | 'FEMALE';

export interface Activity {
  id: string;
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

export interface ActivityParticipant {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  joinedAt: string;
}

export interface ActivityDetails {
  id: string;
  emoji: string;
  title: string;
  startsAt: string;
  place: { name: string; lat: number; lng: number };
  capacity: number;
  participantCount: number;
  genderPreference: ActivityGenderPreference;
  status: ActivityStatus;
  memoriesShareablePublicly: boolean;
  host: ActivityParticipant;
  members: ActivityParticipant[];
  pinnedMessage: ChatMessage | null;
}

export interface EditActivityPayload {
  emoji?: string;
  title?: string;
  startsAt?: string;
  placeName?: string;
  placeLat?: number;
  placeLng?: number;
  capacity?: number;
  genderPreference?: ActivityGenderPreference;
  memoriesShareablePublicly?: boolean;
}

export interface CreateActivityPayload {
  emoji: string;
  title: string;
  startsAt: string;
  placeName: string;
  placeLat: number;
  placeLng: number;
  capacity: number;
  genderPreference: ActivityGenderPreference;
  memoriesShareablePublicly?: boolean;
}
