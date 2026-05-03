import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { formatChatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  Bookmark,
  Calendar,
  Camera,
  Clock,
  type Icon as IconsaxIcon,
  Message,
  Notification as NotificationIcon,
  UserAdd,
  UserRemove,
} from 'iconsax-react-nativejs';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';
import type { NotificationItem } from '../types';

const ICON_BY_EVENT: Record<string, IconsaxIcon> = {
  CHAT_MESSAGE: Message,
  REPLY: Message,
  JOIN: UserAdd,
  LEAVE: UserRemove,
  CANCELLATION: Calendar,
  PINNED: Bookmark,
  NEW_MEMORY: Camera,
  ACTIVITY_START_1H: Clock,
};

interface NotificationRowProps {
  item: NotificationItem;
  onPress: () => void;
}

export function NotificationRow({ item, onPress }: NotificationRowProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const isUnread = !item.readAt;
  const IconComponent =
    (ICON_BY_EVENT[item.eventCode] as never) ?? (NotificationIcon as never);

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'border-border/40 flex-row gap-3 border-b px-6 py-4 active:bg-muted/30',
        isUnread && 'bg-primary/5',
      )}
    >
      <View className="bg-muted size-10 items-center justify-center rounded-full">
        <Icon as={IconComponent} className="text-muted-foreground size-5" />
      </View>
      <View className="flex-1">
        <Text
          className="text-foreground text-base font-semibold"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          className="text-muted-foreground mt-0.5 text-sm"
          numberOfLines={2}
        >
          {item.body}
        </Text>
        <Text className="text-muted-foreground mt-1 text-xs">
          {formatChatDate(new Date(item.createdAt))}
        </Text>
      </View>
      {isUnread ? (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.primary,
            marginTop: 6,
          }}
        />
      ) : null}
    </Pressable>
  );
}
