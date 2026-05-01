import { activityDetailsQueryKey } from '@/features/activities/details/api/getDetails';
import type { QueryClient } from '@tanstack/react-query';
import type { Socket } from 'socket.io-client';
import { CHATS_QUERY_KEY } from '../api/listChats';
import { messagesQueryKey } from '../api/listMessages';
import {
  ChatEvents,
  type ChatActivityUpdatedPayload,
  type ChatMemberRemovedPayload,
  type ChatMessageDeletedPayload,
  type ChatMessageNewPayload,
} from '../chats.events';
import type { MessagesPage } from '../types';

interface InfiniteMessages {
  pages: MessagesPage[];
  pageParams: (string | undefined)[];
}

export function registerChatRealtime(
  socket: Socket,
  qc: QueryClient,
): () => void {
  const onMessageNew = (payload: ChatMessageNewPayload) => {
    const { message } = payload;
    qc.setQueryData<InfiniteMessages>(
      messagesQueryKey(message.activityId),
      (prev) => {
        if (!prev) return prev;
        const [first, ...rest] = prev.pages;
        if (!first) return prev;
        if (first.items.some((m) => m.id === message.id)) return prev;
        return {
          ...prev,
          pages: [{ ...first, items: [message, ...first.items] }, ...rest],
        };
      },
    );
    qc.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
  };

  const onMessageDeleted = (payload: ChatMessageDeletedPayload) => {
    qc.setQueryData<InfiniteMessages>(
      messagesQueryKey(payload.activityId),
      (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((p) => ({
            ...p,
            items: p.items.filter((m) => m.id !== payload.messageId),
          })),
        };
      },
    );
    qc.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
  };

  const onMemberRemoved = (_payload: ChatMemberRemovedPayload) => {
    qc.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
  };

  const onActivityUpdated = (payload: ChatActivityUpdatedPayload) => {
    qc.invalidateQueries({
      queryKey: activityDetailsQueryKey(payload.activityId),
    });
    qc.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
  };

  socket.on(ChatEvents.MessageNew, onMessageNew);
  socket.on(ChatEvents.MessageDeleted, onMessageDeleted);
  socket.on(ChatEvents.MemberRemoved, onMemberRemoved);
  socket.on(ChatEvents.ActivityUpdated, onActivityUpdated);

  return () => {
    socket.off(ChatEvents.MessageNew, onMessageNew);
    socket.off(ChatEvents.MessageDeleted, onMessageDeleted);
    socket.off(ChatEvents.MemberRemoved, onMemberRemoved);
    socket.off(ChatEvents.ActivityUpdated, onActivityUpdated);
  };
}
