import { Text } from '@/components/ui/text';
import { GENDER_LABEL } from '../../labels';
import {
  SLOT_FONT_SIZE,
  SLOT_LINE_HEIGHT,
} from '../../components/fields/Pill';
import { formatRelativeDateTime, relativeDateUsesOnConnector } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import type { ActivityDetails } from '../../types';

interface ActivityHeaderProps {
  details: ActivityDetails;
}

const STATUS_BADGE: Record<
  ActivityDetails['status'],
  { label: string; tone: 'muted' | 'destructive' } | null
> = {
  OPEN: null,
  FULL: { label: 'full', tone: 'muted' },
  CANCELLED: { label: 'cancelled', tone: 'destructive' },
  DONE: { label: 'ended', tone: 'muted' },
};

const HOST_AVATAR_SIZE = 28;

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
      <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1.5">
        <Image
          source={{ uri: details.host.avatarUrl }}
          style={{
            width: HOST_AVATAR_SIZE,
            height: HOST_AVATAR_SIZE,
            borderRadius: HOST_AVATAR_SIZE / 2,
          }}
          className="bg-muted"
        />
        <Word className="text-primary">@{details.host.username}</Word>
        <Word>wants to</Word>
        <Word>{details.emoji}</Word>
        <Word className="font-bold">{details.title}</Word>
        {relativeDateUsesOnConnector(startsAt) ? <Word>on</Word> : null}
        <Word className="text-primary">{formatRelativeDateTime(startsAt)}</Word>
        <Word>at</Word>
        <Pressable onPress={openPlace} hitSlop={6}>
          <Word className="text-primary underline">{details.place.name}</Word>
        </Pressable>
        <Word>with</Word>
        <Word className="text-primary">
          {details.participantCount}/{details.capacity}
        </Word>
        <Word className="text-primary">{GENDER_LABEL[details.genderPreference]}</Word>
      </View>

      {badge ? (
        <View
          className={cn(
            'mt-3 self-start rounded-full px-3 py-1',
            badge.tone === 'destructive' ? 'bg-destructive/10' : 'bg-muted',
          )}
        >
          <Text
            className={cn(
              'text-xs font-semibold',
              badge.tone === 'destructive'
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {badge.label}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function Word({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={cn('text-foreground font-medium', className)}
      style={{ fontSize: SLOT_FONT_SIZE, lineHeight: SLOT_LINE_HEIGHT }}
    >
      {children}
    </Text>
  );
}


