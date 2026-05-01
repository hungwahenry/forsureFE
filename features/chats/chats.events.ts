import type { ChatMessage } from './types';

export const ChatEvents = {
  MessageNew: 'chat.message.new',
  MessageDeleted: 'chat.message.deleted',
  MemberRemoved: 'chat.member.removed',
  ActivityUpdated: 'chat.activity.updated',
} as const;

export interface ChatMessageNewPayload {
  message: ChatMessage;
}

export interface ChatMessageDeletedPayload {
  activityId: string;
  messageId: string;
}

export interface ChatMemberRemovedPayload {
  activityId: string;
}

export interface ChatActivityUpdatedPayload {
  activityId: string;
}
