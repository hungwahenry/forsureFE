import { Text } from '@/components/ui/text';
import { ActivityLine } from '@/features/activities/components/ActivityLine';
import { View } from 'react-native';
import type { UserActivity } from '../types';

interface UserActivityRowProps {
  activity: UserActivity;
}

export function UserActivityRow({ activity }: UserActivityRowProps) {
  return (
    <View className="border-border/40 flex-row items-start gap-3 border-b px-6 py-4">
      <View className="flex-1">
        <ActivityLine
          activity={{
            emoji: activity.emoji,
            title: activity.title,
            startsAt: activity.startsAt,
            placeName: activity.placeName,
          }}
          participantCount={activity.participantCount}
          participantVerb={activity.status === 'DONE' ? 'went' : 'going'}
        />
      </View>
      <View className="bg-muted/60 mt-1 rounded-full px-2 py-0.5">
        <Text className="text-muted-foreground text-[10px] font-semibold uppercase">
          {activity.role.toLowerCase()}
        </Text>
      </View>
    </View>
  );
}
