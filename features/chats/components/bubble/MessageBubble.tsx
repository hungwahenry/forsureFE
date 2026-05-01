import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useColorScheme } from 'nativewind';
import { Image } from 'expo-image';
import { Dimensions, Pressable, View } from 'react-native';
import type { ChatMessage } from '../../types';
import { BubbleImage } from './BubbleImage';
import { BubbleReplyChip } from './BubbleReplyChip';
import { BubbleTail } from './BubbleTail';
import { BubbleTime } from './BubbleTime';
import { SwipeToReply } from './SwipeToReply';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ROW_MAX_WIDTH = Math.floor(SCREEN_WIDTH * 0.78);
const AVATAR_SIZE = 32;
const ROW_GAP = 8;
const PHOTO_WIDTH = Math.min(260, ROW_MAX_WIDTH - AVATAR_SIZE - ROW_GAP);

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  canDelete: boolean;
  canPin: boolean;
  onReply: () => void;
  onDelete: () => void;
  onRetry: () => void;
  onCancel: () => void;
  onPin: () => void;
}

export function MessageBubble({
  message,
  isOwn,
  canDelete,
  canPin,
  onReply,
  onDelete,
  onRetry,
  onCancel,
  onPin,
}: MessageBubbleProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const bubbleColor = isOwn ? colors.primary : colors.muted;
  const isPending = message.pending === true;
  const isFailed = message.failed === true;
  const hasImage = message.imageUrl != null;
  const hasBody = message.body != null && message.body.length > 0;

  return (
    <View className={cn('px-4 py-1', isOwn ? 'items-end' : 'items-start')}>
      <SwipeToReply onReply={onReply} disabled={isPending || isFailed}>
      <View
        style={{ maxWidth: ROW_MAX_WIDTH, gap: !isOwn ? ROW_GAP : 0 }}
        className="flex-row items-end"
      >
        {!isOwn ? (
          <Image
            source={{ uri: message.sender.avatarUrl }}
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
            className="bg-muted"
          />
        ) : null}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Pressable onPress={isFailed ? onRetry : undefined}>
              <View
                className={cn(
                  'relative',
                  isPending && 'opacity-70',
                  isFailed && 'opacity-60',
                )}
              >
                <View
                  className={cn(
                    'rounded-2xl',
                    hasImage ? 'p-1' : 'px-3 py-2',
                    isOwn ? 'bg-primary' : 'bg-muted',
                  )}
                >
                  {!isOwn && !hasImage ? (
                    <Text className="text-muted-foreground mb-0.5 text-xs font-semibold">
                      @{message.sender.username}
                    </Text>
                  ) : null}

                  {message.parent ? (
                    <BubbleReplyChip parent={message.parent} isOwn={isOwn} />
                  ) : null}

                  {hasImage && message.imageUrl ? (
                    <BubbleImage
                      uri={message.imageUrl}
                      width={PHOTO_WIDTH}
                      pending={isPending}
                    />
                  ) : null}

                  {hasBody ? (
                    <Text
                      className={cn(
                        'text-base',
                        isOwn ? 'text-primary-foreground' : 'text-foreground',
                        hasImage ? 'px-2 pb-1 pt-2' : '',
                      )}
                    >
                      {message.body}
                    </Text>
                  ) : null}

                  <BubbleTime
                    createdAt={message.createdAt}
                    isOwn={isOwn}
                    hasImage={hasImage}
                    hasBody={hasBody}
                  />
                </View>
                <BubbleTail
                  color={bubbleColor}
                  side={isOwn ? 'right' : 'left'}
                />
              </View>
            </Pressable>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {isFailed ? (
              <>
                <ContextMenuItem onPress={onRetry}>
                  <Text>retry</Text>
                </ContextMenuItem>
                <ContextMenuItem variant="destructive" onPress={onCancel}>
                  <Text>remove</Text>
                </ContextMenuItem>
              </>
            ) : (
              <>
                <ContextMenuItem onPress={onReply} disabled={isPending}>
                  <Text>reply</Text>
                </ContextMenuItem>
                {canPin ? (
                  <ContextMenuItem onPress={onPin} disabled={isPending}>
                    <Text>pin</Text>
                  </ContextMenuItem>
                ) : null}
                {canDelete ? (
                  <ContextMenuItem
                    variant="destructive"
                    onPress={onDelete}
                    disabled={isPending}
                  >
                    <Text>delete</Text>
                  </ContextMenuItem>
                ) : null}
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </View>
      </SwipeToReply>
      {isFailed ? (
        <Text className="text-destructive mt-0.5 text-xs">
          failed · tap to retry
        </Text>
      ) : null}
    </View>
  );
}
