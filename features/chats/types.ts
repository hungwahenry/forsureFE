import type { ActivityStatus } from '../activities/types';

export type ChatMessageKind = 'TEXT' | 'SYSTEM';

export interface PendingImage {
  uri: string;
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  activityId: string;
  kind: ChatMessageKind;
  body: string | null;
  imageUrl: string | null;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  parent: {
    id: string;
    body: string | null;
    hasImage: boolean;
    sender: { id: string; username: string };
  } | null;
  pending?: boolean;
  failed?: boolean;
}

export interface ChatPreview {
  activityId: string;
  title: string;
  emoji: string;
  startsAt: string;
  placeName: string;
  status: ActivityStatus;
  hostUserId: string;
  unreadCount: number;
  lastMessage: {
    id: string;
    body: string | null;
    hasImage: boolean;
    createdAt: string;
    senderUsername: string;
  } | null;
}

export interface MessagesPage {
  items: ChatMessage[];
  pageInfo: { nextCursor: string | null; hasMore: boolean };
}
