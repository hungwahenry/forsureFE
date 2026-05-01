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
import { Dimensions, Image, View } from 'react-native';
import type { ChatMessage } from '../types';
import { BubbleTail } from './BubbleTail';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ROW_MAX_WIDTH = Math.floor(SCREEN_WIDTH * 0.78);
const AVATAR_SIZE = 32;
const ROW_GAP = 8;
const PHOTO_WIDTH = Math.min(260, ROW_MAX_WIDTH - AVATAR_SIZE - ROW_GAP);

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  canDelete: boolean;
  onReply: () => void;
  onDelete: () => void;
}

export function MessageBubble({
  message,
  isOwn,
  canDelete,
  onReply,
  onDelete,
}: MessageBubbleProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const bubbleColor = isOwn ? colors.primary : colors.muted;

  return (
    <View
      className={cn('px-4 py-1', isOwn ? 'items-end' : 'items-start')}
    >
      <View
        style={{ maxWidth: ROW_MAX_WIDTH, gap: !isOwn ? ROW_GAP : 0 }}
        className="flex-row items-end"
      >
        {!isOwn ? (
          <Image
            source={{ uri: message.sender.avatarUrl }}
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            className="bg-muted rounded-full"
          />
        ) : null}
        <ContextMenu>
          <ContextMenuTrigger>
            <View className="relative">
              <View
                className={cn(
                  'rounded-2xl',
                  message.imageUrl ? 'overflow-hidden' : 'px-3 py-2',
                  isOwn ? 'bg-primary' : 'bg-muted',
                )}
              >
              {!isOwn && !message.imageUrl ? (
                <Text className="text-muted-foreground mb-0.5 text-xs font-semibold">
                  @{message.sender.username}
                </Text>
              ) : null}

              {message.parent ? (
                <View
                  className={cn(
                    'mb-1.5 rounded-lg px-2 py-1',
                    isOwn ? 'bg-primary-foreground/15' : 'bg-foreground/5',
                  )}
                >
                  <Text
                    className={cn(
                      'text-[11px] font-semibold',
                      isOwn
                        ? 'text-primary-foreground/90'
                        : 'text-foreground/70',
                    )}
                    numberOfLines={1}
                  >
                    @{message.parent.sender.username}
                  </Text>
                  <Text
                    className={cn(
                      'text-xs',
                      isOwn
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground',
                    )}
                    numberOfLines={1}
                  >
                    {message.parent.body ??
                      (message.parent.hasImage ? 'photo' : '')}
                  </Text>
                </View>
              ) : null}

              {message.imageUrl ? (
                <Image
                  source={{ uri: message.imageUrl }}
                  style={{ width: PHOTO_WIDTH, aspectRatio: 1 }}
                  className="bg-muted"
                  resizeMode="cover"
                />
              ) : null}

              {message.body ? (
                <Text
                  className={cn(
                    'text-base',
                    isOwn ? 'text-primary-foreground' : 'text-foreground',
                    message.imageUrl ? 'px-3 py-2' : '',
                  )}
                >
                  {message.body}
                </Text>
              ) : null}
            </View>
            <BubbleTail color={bubbleColor} side={isOwn ? 'right' : 'left'} />
            </View>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onPress={onReply}>
              <Text>reply</Text>
            </ContextMenuItem>
            {canDelete ? (
              <ContextMenuItem variant="destructive" onPress={onDelete}>
                <Text>delete</Text>
              </ContextMenuItem>
            ) : null}
          </ContextMenuContent>
        </ContextMenu>
      </View>
    </View>
  );
}
