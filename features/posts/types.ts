export type PostVisibility = 'PARTICIPANTS' | 'PUBLIC';

export interface ActivityPostPhoto {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface ActivityPostAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export interface ActivityPost {
  id: string;
  activityId: string;
  caption: string | null;
  visibility: PostVisibility;
  createdAt: string;
  updatedAt: string;
  author: ActivityPostAuthor;
  photos: ActivityPostPhoto[];
}

export interface PendingPhoto {
  uri: string;
  mimeType: string;
}
