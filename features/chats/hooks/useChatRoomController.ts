import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import * as React from 'react';
import { useDeleteMessage } from '../api/deleteMessage';
import { useListMessages } from '../api/listMessages';
import { useMarkChatRead } from '../api/markRead';
import { useSendMessage } from '../api/sendMessage';
import type { PendingImage } from '../components/MessageComposer';
import type { ChatMessage } from '../types';
import { useChatRoom } from './useChatRoom';

interface UseChatRoomControllerArgs {
  activityId: string;
  onRemoved: () => void;
}

export function useChatRoomController({
  activityId,
  onRemoved,
}: UseChatRoomControllerArgs) {
  const messagesQuery = useListMessages(activityId);
  const sendMutation = useSendMessage();
  const deleteMutation = useDeleteMessage();
  const markRead = useMarkChatRead();
  const [replyTarget, setReplyTarget] = React.useState<ChatMessage | null>(
    null,
  );

  useChatRoom({ activityId, onRemoved });

  const newestId = messagesQuery.data?.pages[0]?.items[0]?.id ?? null;
  React.useEffect(() => {
    markRead.mutate({ activityId });
  }, [activityId, newestId]);

  const messages = React.useMemo(
    () => messagesQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [messagesQuery.data],
  );

  const send = async (input: {
    body?: string;
    image?: PendingImage;
  }): Promise<void> => {
    try {
      await sendMutation.mutateAsync({
        activityId,
        body: input.body,
        image: input.image,
        parentMessageId: replyTarget?.id,
      });
      setReplyTarget(null);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't send. try again.";
      toast.error(message);
    }
  };

  const remove = async (m: ChatMessage): Promise<void> => {
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
  };
}
