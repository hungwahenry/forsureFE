import { Text } from '@/components/ui/text';
import { useOpenUserProfile } from '@/features/users/hooks/useOpenUserProfile';
import { cn } from '@/lib/utils';
import { View } from 'react-native';
import type { ChatMessage } from '../../types';

interface BubbleReplyChipProps {
  parent: NonNullable<ChatMessage['parent']>;
  isOwn: boolean;
}

export function BubbleReplyChip({ parent, isOwn }: BubbleReplyChipProps) {
  const openUserProfile = useOpenUserProfile();
  return (
    <View
      className={cn(
        'mb-1.5 rounded-lg px-2 py-1',
        isOwn ? 'bg-primary-foreground/15' : 'bg-foreground/5',
      )}
    >
      <Text
        className={cn(
          'text-[11px] font-semibold',
          isOwn ? 'text-primary-foreground/90' : 'text-foreground/70',
        )}
        onPress={() => openUserProfile(parent.sender.username)}
        numberOfLines={1}
      >
        @{parent.sender.username}
      </Text>
      <Text
        className={cn(
          'text-xs',
          isOwn ? 'text-primary-foreground/80' : 'text-muted-foreground',
        )}
        numberOfLines={1}
      >
        {parent.body ?? (parent.hasImage ? 'photo' : '')}
      </Text>
    </View>
  );
}
