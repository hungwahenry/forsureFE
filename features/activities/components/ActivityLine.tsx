import { Text } from '@/components/ui/text';
import { useOpenUserProfile } from '@/features/users/hooks/useOpenUserProfile';
import { formatRelativeDateTime } from '@/lib/format';
import { View } from 'react-native';

interface ActivityLineProps {
  activity: {
    emoji: string;
    title: string;
    startsAt?: string;
    placeName?: string;
  };
  hostUsername?: string;
  lead?: string;
  participantCount?: number;
  /** Verb after the count, e.g. 'went' or 'going'. Defaults to 'went'. */
  participantVerb?: string;
}

export function ActivityLine({
  activity,
  hostUsername,
  lead,
  participantCount,
  participantVerb = 'went',
}: ActivityLineProps) {
  const openUserProfile = useOpenUserProfile();
  const showFootnote =
    !!(activity.startsAt || activity.placeName) || participantCount != null;

  return (
    <View>
      <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
        {hostUsername ? (
          <>
            <Text
              className="text-primary text-base font-medium leading-6 underline"
              onPress={() => openUserProfile(hostUsername)}
            >
              @{hostUsername}
            </Text>
            <Text className="text-foreground text-base font-medium leading-6">
              wanted to
            </Text>
          </>
        ) : lead ? (
          <Text className="text-foreground text-base font-medium leading-6">
            {lead}
          </Text>
        ) : null}
        <Text className="text-foreground text-base font-medium leading-6">
          {activity.emoji}
        </Text>
        <Text className="text-foreground text-base font-bold leading-6">
          {activity.title}
        </Text>
      </View>
      {showFootnote ? (
        <Text className="text-muted-foreground mt-1 text-xs">
          {[
            activity.startsAt
              ? formatRelativeDateTime(new Date(activity.startsAt))
              : null,
            activity.placeName,
            participantCount != null
              ? `${participantCount} ${participantVerb}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      ) : null}
    </View>
  );
}
