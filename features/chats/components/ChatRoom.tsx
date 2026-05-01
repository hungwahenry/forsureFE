import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { useActivityDetails } from '@/features/activities/details/api/getDetails';
import type { ActivityStatus } from '@/features/activities/types';
import { Message } from 'iconsax-react-nativejs';
import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';
import { useChatRoomController } from '../hooks/useChatRoomController';
import { MessageComposer } from './composer/MessageComposer';
import { MessageList } from './messages/MessageList';
import { PinnedMessageBanner } from './PinnedMessageBanner';

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
  const c = useChatRoomController({ activityId, viewerUserId, hostUserId });
  const details = useActivityDetails(activityId);
  const pinnedMessage = details.data?.pinnedMessage ?? null;
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
      <AnimatePresence>
        {pinnedMessage ? (
          <MotiView
            key={pinnedMessage.id}
            from={{ opacity: 0, translateY: -6 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -6 }}
            transition={{ type: 'timing', duration: 220 }}
          >
            <PinnedMessageBanner
              message={pinnedMessage}
              canUnpin={c.viewerIsHost}
              onUnpin={() => void c.unpin()}
            />
          </MotiView>
        ) : null}
      </AnimatePresence>
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
          viewerIsHost={c.viewerIsHost}
          isFetchingOlder={c.isFetchingOlder}
          onEndReached={c.fetchOlder}
          onReply={c.setReplyTarget}
          onDelete={(m) => void c.remove(m)}
          onRetry={(m) => void c.retry(m)}
          onCancel={c.cancelFailed}
          onPin={(m) => void c.pin(m)}
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
