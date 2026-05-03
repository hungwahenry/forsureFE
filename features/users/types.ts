import type { ActivityRole, ActivityStatus } from '@/features/activities/types';
import type { PostVisibility } from '@/features/posts/types';

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';

export interface MyProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string;
  gender: Gender;
  age: number;
  dateOfBirth: string;
  place: { name: string; lat: number; lng: number };
  memberSince: string;
  stats: {
    activitiesHosted: number;
    activitiesJoined: number;
    activitiesCompleted: number;
    memoriesShared: number;
  };
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string;
  gender: Gender;
  age: number;
  placeName: string;
  memberSince: string;
  stats: {
    activitiesHosted: number;
    activitiesCompleted: number;
    memoriesShared: number;
  };
}

export type UserProfile = MyProfile | PublicProfile;

export function isMyProfile(p: UserProfile): p is MyProfile {
  return 'email' in p;
}

export interface UserPostPhoto {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface UserPostActivity {
  id: string;
  emoji: string;
  title: string;
  startsAt: string;
  placeName: string;
  participantCount: number;
}

export interface UserPost {
  id: string;
  caption: string | null;
  visibility: PostVisibility;
  createdAt: string;
  photos: UserPostPhoto[];
  activity: UserPostActivity;
}

export interface UserActivity {
  id: string;
  emoji: string;
  title: string;
  startsAt: string;
  placeName: string;
  status: ActivityStatus;
  role: ActivityRole;
  participantCount: number;
}

export interface UserPostsPage {
  items: UserPost[];
  pageInfo: { nextCursor: string | null; hasMore: boolean };
}

export interface UserActivitiesPage {
  items: UserActivity[];
  pageInfo: { nextCursor: string | null; hasMore: boolean };
}
