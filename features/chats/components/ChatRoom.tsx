import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Message } from 'iconsax-react-nativejs';
import { View } from 'react-native';
import { useChatRoomController } from '../hooks/useChatRoomController';
import { MessageComposer } from './MessageComposer';
import { MessageList } from './MessageList';

interface ChatRoomProps {
  activityId: string;
  viewerUserId: string;
  hostUserId: string;
  onRemoved: () => void;
}

export function ChatRoom({
  activityId,
  viewerUserId,
  hostUserId,
  onRemoved,
}: ChatRoomProps) {
  const c = useChatRoomController({ activityId, onRemoved });

  if (c.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingIndicator size={10} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {c.messages.length === 0 ? (
        <EmptyState
          icon={Message}
          title="no messages yet"
          subtitle="say hi — break the ice."
          className="flex-1 justify-center pt-0"
        />
      ) : (
        <MessageList
          messages={c.messages}
          viewerUserId={viewerUserId}
          hostUserId={hostUserId}
          isFetchingOlder={c.isFetchingOlder}
          onEndReached={c.fetchOlder}
          onReply={c.setReplyTarget}
          onDelete={(m) => void c.remove(m)}
        />
      )}
      <MessageComposer
        replyTarget={c.replyTarget}
        onClearReply={c.clearReply}
        onSend={c.send}
        disabled={c.isSending}
      />
    </View>
  );
}
