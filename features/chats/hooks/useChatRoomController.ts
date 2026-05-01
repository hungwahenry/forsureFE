import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useDeleteMessage } from '../api/deleteMessage';
import { useListMessages, messagesQueryKey } from '../api/listMessages';
import { useMarkChatRead } from '../api/markRead';
import {
  useSendMessage,
  type SendMessageArgs,
} from '../api/sendMessage';
import type { PendingImage } from '../components/composer/MessageComposer';
import type { ChatMessage, MessagesPage } from '../types';

interface UseChatRoomControllerArgs {
  activityId: string;
  viewerUserId: string;
}

interface InfiniteMessages {
  pages: MessagesPage[];
  pageParams: (string | undefined)[];
}

const tempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export function useChatRoomController({
  activityId,
  viewerUserId,
}: UseChatRoomControllerArgs) {
  const qc = useQueryClient();
  const messagesQuery = useListMessages(activityId);
  const sendMutation = useSendMessage();
  const deleteMutation = useDeleteMessage();
  const markRead = useMarkChatRead();
  const [replyTarget, setReplyTarget] = React.useState<ChatMessage | null>(
    null,
  );

  const newestId = messagesQuery.data?.pages[0]?.items[0]?.id ?? null;
  React.useEffect(() => {
    markRead.mutate({ activityId });
  }, [activityId, newestId]);

  const messages = React.useMemo(
    () => messagesQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [messagesQuery.data],
  );

  const insertOptimistic = (msg: ChatMessage) => {
    qc.setQueryData<InfiniteMessages>(messagesQueryKey(activityId), (prev) => {
      if (!prev) return prev;
      const [first, ...rest] = prev.pages;
      if (!first) return prev;
      return {
        ...prev,
        pages: [{ ...first, items: [msg, ...first.items] }, ...rest],
      };
    });
  };

  const replaceOptimistic = (id: string, real: ChatMessage) => {
    qc.setQueryData<InfiniteMessages>(messagesQueryKey(activityId), (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map((p) => {
          const realAlreadyThere = p.items.some((m) => m.id === real.id);
          return {
            ...p,
            items: realAlreadyThere
              ? p.items.filter((m) => m.id !== id)
              : p.items.map((m) => (m.id === id ? real : m)),
          };
        }),
      };
    });
  };

  const markFailed = (id: string) => {
    qc.setQueryData<InfiniteMessages>(messagesQueryKey(activityId), (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map((p) => ({
          ...p,
          items: p.items.map((m) =>
            m.id === id ? { ...m, pending: false, failed: true } : m,
          ),
        })),
      };
    });
  };

  const removeMessage = (id: string) => {
    qc.setQueryData<InfiniteMessages>(messagesQueryKey(activityId), (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map((p) => ({
          ...p,
          items: p.items.filter((m) => m.id !== id),
        })),
      };
    });
  };

  const sendArgsFor = (input: {
    body?: string;
    image?: PendingImage;
  }): SendMessageArgs => ({
    activityId,
    body: input.body,
    image: input.image,
    parentMessageId: replyTarget?.id,
  });

  const buildOptimistic = (input: {
    body?: string;
    image?: PendingImage;
  }): ChatMessage => ({
    id: tempId(),
    activityId,
    kind: 'TEXT',
    body: input.body ?? null,
    imageUrl: input.image?.uri ?? null,
    createdAt: new Date().toISOString(),
    sender: {
      id: viewerUserId,
      username: '',
      displayName: '',
      avatarUrl: '',
    },
    parent: replyTarget
      ? {
          id: replyTarget.id,
          body: replyTarget.body,
          hasImage: replyTarget.imageUrl != null,
          sender: {
            id: replyTarget.sender.id,
            username: replyTarget.sender.username,
          },
        }
      : null,
    pending: true,
  });

  const send = async (input: {
    body?: string;
    image?: PendingImage;
  }): Promise<void> => {
    const optimistic = buildOptimistic(input);
    const args = sendArgsFor(input);
    insertOptimistic(optimistic);
    setReplyTarget(null);
    try {
      const real = await sendMutation.mutateAsync(args);
      replaceOptimistic(optimistic.id, real);
    } catch (err) {
      markFailed(optimistic.id);
      const message =
        err instanceof ApiError ? err.message : "couldn't send. try again.";
      toast.error(message);
    }
  };

  const retry = async (failed: ChatMessage): Promise<void> => {
    if (!failed.failed) return;
    qc.setQueryData<InfiniteMessages>(messagesQueryKey(activityId), (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map((p) => ({
          ...p,
          items: p.items.map((m) =>
            m.id === failed.id ? { ...m, pending: true, failed: false } : m,
          ),
        })),
      };
    });
    try {
      const real = await sendMutation.mutateAsync({
        activityId,
        body: failed.body ?? undefined,
        image: failed.imageUrl
          ? {
              uri: failed.imageUrl,
              mimeType: 'image/jpeg',
            }
          : undefined,
        parentMessageId: failed.parent?.id,
      });
      replaceOptimistic(failed.id, real);
    } catch (err) {
      markFailed(failed.id);
      const message =
        err instanceof ApiError ? err.message : "couldn't send. try again.";
      toast.error(message);
    }
  };

  const cancelFailed = (m: ChatMessage) => {
    if (!m.failed) return;
    removeMessage(m.id);
  };

  const remove = async (m: ChatMessage): Promise<void> => {
    if (m.pending || m.failed) {
      removeMessage(m.id);
      return;
    }
    try {
      await deleteMutation.mutateAsync({ activityId, messageId: m.id });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't delete.";
      toast.error(message);
    }
  };

  const fetchOlder = () => {
    if (messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
      void messagesQuery.fetchNextPage();
    }
  };

  return {
    messages,
    isPending: messagesQuery.isPending,
    isFetchingOlder: messagesQuery.isFetchingNextPage,
    isSending: sendMutation.isPending,
    replyTarget,
    setReplyTarget,
    clearReply: () => setReplyTarget(null),
    fetchOlder,
    send,
    remove,
    retry,
    cancelFailed,
  };
}
