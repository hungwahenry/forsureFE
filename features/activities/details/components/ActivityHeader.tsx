import { Text } from '@/components/ui/text';
import { formatRelativeDateTime } from '@/lib/format';
import { GENDER_LABEL } from '../../labels';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import type { ActivityDetails } from '../../types';

interface ActivityHeaderProps {
  details: ActivityDetails;
}

const STATUS_BADGE: Record<
  ActivityDetails['status'],
  { label: string; tone: 'muted' | 'warning' | 'destructive' } | null
> = {
  OPEN: null,
  FULL: { label: 'full', tone: 'muted' },
  CANCELLED: { label: 'cancelled', tone: 'destructive' },
  DONE: { label: 'ended', tone: 'muted' },
};

export function ActivityHeader({ details }: ActivityHeaderProps) {
  const router = useRouter();
  const startsAt = new Date(details.startsAt);
  const badge = STATUS_BADGE[details.status];

  const openPlace = () =>
    router.push({
      pathname: '/place-view',
      params: {
        name: details.place.name,
        lat: String(details.place.lat),
        lng: String(details.place.lng),
      },
    });

  return (
    <View className="px-6 py-5">
      <View className="flex-row items-center gap-3">
        <Text className="text-5xl">{details.emoji}</Text>
        <View className="flex-1">
          <Text className="text-foreground text-xl font-bold" numberOfLines={2}>
            {details.title}
          </Text>
          {badge ? (
            <View
              className={
                badge.tone === 'destructive'
                  ? 'bg-destructive/10 mt-1 self-start rounded-full px-2 py-0.5'
                  : 'bg-muted mt-1 self-start rounded-full px-2 py-0.5'
              }
            >
              <Text
                className={
                  badge.tone === 'destructive'
                    ? 'text-destructive text-xs font-semibold'
                    : 'text-muted-foreground text-xs font-semibold'
                }
              >
                {badge.label}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className="mt-4 gap-2">
        <Row label="when">
          <Text className="text-foreground text-base">
            {formatRelativeDateTime(startsAt)}
          </Text>
        </Row>
        <Row label="where">
          <Pressable onPress={openPlace} hitSlop={6}>
            <Text className="text-primary text-base underline" numberOfLines={1}>
              {details.place.name}
            </Text>
          </Pressable>
        </Row>
        <Row label="going">
          <Text className="text-foreground text-base">
            {details.participantCount} of {details.capacity}
          </Text>
        </Row>
        <Row label="who">
          <Text className="text-foreground text-base">
            {GENDER_LABEL[details.genderPreference]}
          </Text>
        </Row>
      </View>
    </View>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-muted-foreground w-14 text-sm">{label}</Text>
      <View className="flex-1">{children}</View>
    </View>
  );
}
