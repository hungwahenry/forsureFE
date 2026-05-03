import { Text } from '@/components/ui/text';
import { formatChatDate } from '@/lib/format';
import { View } from 'react-native';
import type { UserActivity } from '../types';

interface UserActivityRowProps {
  activity: UserActivity;
}

export function UserActivityRow({ activity }: UserActivityRowProps) {
  return (
    <View className="border-border/40 flex-row items-center gap-3 border-b px-6 py-4">
      <View className="bg-muted size-12 items-center justify-center rounded-full">
        <Text className="text-2xl">{activity.emoji}</Text>
      </View>
      <View className="flex-1">
        <Text
          className="text-foreground text-base font-semibold"
          numberOfLines={1}
        >
          {activity.title}
        </Text>
        <Text className="text-muted-foreground text-xs" numberOfLines={1}>
          {formatChatDate(new Date(activity.startsAt))} · {activity.placeName}
        </Text>
      </View>
      <View className="bg-muted/60 rounded-full px-2 py-0.5">
        <Text className="text-muted-foreground text-[10px] font-semibold uppercase">
          {activity.role.toLowerCase()}
        </Text>
      </View>
    </View>
  );
}
