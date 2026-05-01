import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CloseCircle } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';
import type { ChatMessage } from '../types';

interface ReplyPreviewProps {
  target: ChatMessage;
  onClear: () => void;
}

export function ReplyPreview({ target, onClear }: ReplyPreviewProps) {
  return (
    <View className="border-border/40 bg-muted/40 flex-row items-center gap-3 border-t px-4 py-2">
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs font-semibold">
          replying to @{target.sender.username}
        </Text>
        <Text className="text-foreground text-sm" numberOfLines={1}>
          {target.body ?? (target.imageUrl ? 'photo' : '')}
        </Text>
      </View>
      <Pressable onPress={onClear} hitSlop={8}>
        <Icon as={CloseCircle} className="text-muted-foreground size-5" />
      </Pressable>
    </View>
  );
}
