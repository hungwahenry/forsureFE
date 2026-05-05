import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { ExportSquare } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable } from 'react-native';
import type { ActivityGenderPreference, ActivityStatus } from '../../types';
import type { SharableActivity } from './ActivityShareCard';
import { useShareActivity } from '../hooks/useShareActivity';

export interface ShareButtonSource {
  id: string;
  emoji: string;
  title: string;
  startsAt: string;
  place: { name: string };
  capacity: number;
  genderPreference: ActivityGenderPreference;
  host: { username: string; displayName: string; avatarUrl: string };
  participantCount?: number;
  goingCount?: number;
  status?: ActivityStatus;
}

interface Props {
  source: ShareButtonSource | null;
  className?: string;
}

export function ShareButton({ source, className }: Props) {
  const sharable = React.useMemo<SharableActivity | null>(() => {
    if (!source) return null;
    return {
      id: source.id,
      emoji: source.emoji,
      title: source.title,
      startsAt: source.startsAt,
      place: source.place,
      capacity: source.capacity,
      participantCount: source.participantCount ?? source.goingCount ?? 0,
      genderPreference: source.genderPreference,
      status: source.status ?? 'OPEN',
      host: source.host,
    };
  }, [source]);

  const onPress = useShareActivity(sharable);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className={cn(
        'size-8 items-center justify-center rounded-full active:bg-muted',
        className,
      )}
    >
      <Icon as={ExportSquare} className="text-muted-foreground size-5" />
    </Pressable>
  );
}
