import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Bookmark, CloseCircle } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';
import type { ChatMessage } from '../types';

interface PinnedMessageBannerProps {
  message: ChatMessage;
  canUnpin: boolean;
  onUnpin: () => void;
}

export function PinnedMessageBanner({
  message,
  canUnpin,
  onUnpin,
}: PinnedMessageBannerProps) {
  const preview = message.body
    ? message.body.slice(0, 80) + (message.body.length > 80 ? '…' : '')
    : message.imageUrl
      ? 'photo'
      : '';

  return (
    <View className="border-border/40 bg-muted/30 flex-row items-center gap-2 border-b px-4 py-2">
      <Icon as={Bookmark} className="text-primary size-4" />
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs font-semibold">
          pinned message
        </Text>
        <Text className="text-foreground text-sm" numberOfLines={1}>
          {preview}
        </Text>
      </View>
      {canUnpin ? (
        <Pressable onPress={onUnpin} hitSlop={8}>
          <Icon as={CloseCircle} className="text-muted-foreground size-5" />
        </Pressable>
      ) : null}
    </View>
  );
}
