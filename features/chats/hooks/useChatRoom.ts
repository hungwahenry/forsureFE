import { getTokens } from '@/lib/auth/tokenStorage';
import { getChatsSocket } from '@/lib/api/socket';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { type Socket } from 'socket.io-client';
import {
  CHATS_QUERY_KEY,
} from '../api/listChats';
import { messagesQueryKey } from '../api/listMessages';
import type { ChatMessage, MessagesPage } from '../types';

interface UseChatRoomArgs {
  activityId: string;
  onRemoved?: () => void;
}

export function useChatRoom({ activityId, onRemoved }: UseChatRoomArgs): void {
  const qc = useQueryClient();
  const onRemovedRef = React.useRef(onRemoved);
  React.useEffect(() => {
    onRemovedRef.current = onRemoved;
  }, [onRemoved]);

  React.useEffect(() => {
    let socket: Socket | null = null;
    let cancelled = false;

    const handleNew = (payload: { message: ChatMessage }) => {
      if (payload.message.activityId !== activityId) return;
      qc.setQueryData<{
        pages: MessagesPage[];
        pageParams: (string | undefined)[];
      }>(messagesQueryKey(activityId), (prev) => {
        if (!prev) return prev;
        const [first, ...rest] = prev.pages;
        if (!first) return prev;
        if (first.items.some((m) => m.id === payload.message.id)) return prev;
        return {
          ...prev,
          pages: [
            { ...first, items: [payload.message, ...first.items] },
            ...rest,
          ],
        };
      });
      qc.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    };

    const handleDeleted = (payload: {
      activityId: string;
      messageId: string;
    }) => {
      if (payload.activityId !== activityId) return;
      qc.setQueryData<{
        pages: MessagesPage[];
        pageParams: (string | undefined)[];
      }>(messagesQueryKey(activityId), (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((p) => ({
            ...p,
            items: p.items.filter((m) => m.id !== payload.messageId),
          })),
        };
      });
      qc.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    };

    const handleRemoved = (payload: { activityId: string }) => {
      if (payload.activityId !== activityId) return;
      onRemovedRef.current?.();
    };

    void (async () => {
      const tokens = await getTokens();
      if (!tokens || cancelled) return;
      socket = getChatsSocket({ accessToken: tokens.accessToken });
      socket.on('message.new', handleNew);
      socket.on('message.deleted', handleDeleted);
      socket.on('chat:removed', handleRemoved);
      socket.emit('chat:join', { activityId });
    })();

    return () => {
      cancelled = true;
      if (socket) {
        socket.off('message.new', handleNew);
        socket.off('message.deleted', handleDeleted);
        socket.off('chat:removed', handleRemoved);
        socket.emit('chat:leave', { activityId });
      }
    };
  }, [activityId, qc]);
}
