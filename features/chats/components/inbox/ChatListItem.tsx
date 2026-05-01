import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { MotiView } from 'moti';
import { Pressable, View } from 'react-native';
import type { ChatPreview } from '../../types';

interface ChatListItemProps {
  preview: ChatPreview;
  index?: number;
  onPress: () => void;
}

export function ChatListItem({ preview, index = 0, onPress }: ChatListItemProps) {
  const hasUnread = preview.unreadCount > 0;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 6 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 260, delay: Math.min(index, 8) * 35 }}
    >
    <Pressable
      onPress={onPress}
      className="border-border/40 active:bg-muted/30 flex-row items-center gap-3 border-b px-6 py-4"
    >
      <View className="bg-muted size-12 items-center justify-center rounded-full">
        <Text className="text-2xl">{preview.emoji}</Text>
      </View>
      <View className="flex-1">
        <Text
          className="text-foreground text-base font-semibold"
          numberOfLines={1}
        >
          {preview.title}
        </Text>
        <Text
          className={cn(
            'text-sm',
            hasUnread
              ? 'text-foreground font-medium'
              : 'text-muted-foreground',
          )}
          numberOfLines={1}
        >
          {previewLine(preview)}
        </Text>
      </View>
      {hasUnread ? (
        <View className="bg-primary min-w-6 items-center justify-center rounded-full px-2 py-0.5">
          <Text className="text-primary-foreground text-xs font-semibold">
            {preview.unreadCount > 99 ? '99+' : preview.unreadCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
    </MotiView>
  );
}

function previewLine(p: ChatPreview): string {
  const m = p.lastMessage;
  if (!m) return 'no messages yet — say hi.';
  const who = `@${m.senderUsername}: `;
  if (m.body) return `${who}${m.body}`;
  if (m.hasImage) return `${who}sent a photo`;
  return who;
}
