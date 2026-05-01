import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import type { ActivityStatus } from '@/features/activities/types';
import { Message } from 'iconsax-react-nativejs';
import { View } from 'react-native';
import { useChatRoomController } from '../hooks/useChatRoomController';
import { MessageComposer } from './composer/MessageComposer';
import { MessageList } from './messages/MessageList';

interface ChatRoomProps {
  activityId: string;
  viewerUserId: string;
  hostUserId: string;
  status: ActivityStatus;
}

const LOCKED_STATUSES: ActivityStatus[] = ['CANCELLED', 'DONE'];

export function ChatRoom({
  activityId,
  viewerUserId,
  hostUserId,
  status,
}: ChatRoomProps) {
  const c = useChatRoomController({ activityId, viewerUserId });
  const isLocked = LOCKED_STATUSES.includes(status);

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
          onRetry={(m) => void c.retry(m)}
          onCancel={c.cancelFailed}
        />
      )}
      {isLocked ? (
        <View className="border-border/40 bg-muted/30 border-t px-6 py-4">
          <Text className="text-muted-foreground text-center text-sm">
            {status === 'CANCELLED'
              ? 'this activity was cancelled'
              : 'this activity has ended'}
          </Text>
        </View>
      ) : (
        <MessageComposer
          replyTarget={c.replyTarget}
          onClearReply={c.clearReply}
          onSend={c.send}
          disabled={c.isSending}
        />
      )}
    </View>
  );
}
