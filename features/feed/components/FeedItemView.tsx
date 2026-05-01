import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { GENDER_LABEL } from '@/features/activities/labels';
import {
  formatRelativeDateTime,
  relativeDateUsesOnConnector,
} from '@/lib/format';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { MotiView } from 'moti';
import type { FeedItem } from '../types';

const SENTENCE_FONT_SIZE = 26;
const SENTENCE_LINE_HEIGHT = 32;
const HOST_AVATAR_SIZE = 28;
const STACK_AVATAR_SIZE = 28;
const STACK_OVERLAP = 10;

interface FeedItemViewProps {
  item: FeedItem;
  index?: number;
  onJoinPress: () => void;
  onPress: () => void;
}

export function FeedItemView({
  item,
  index = 0,
  onJoinPress,
  onPress,
}: FeedItemViewProps) {
  const router = useRouter();
  const date = React.useMemo(() => new Date(item.startsAt), [item.startsAt]);

  const openPlaceView = () => {
    router.push({
      pathname: '/place-view',
      params: {
        name: item.place.name,
        lat: String(item.place.lat),
        lng: String(item.place.lng),
      },
    });
  };
  const goingAvatars = [
    item.host.avatarUrl,
    ...item.participantAvatarUrls.slice(0, 2),
  ];
  const overflow = Math.max(0, item.goingCount - goingAvatars.length);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 280, delay: Math.min(index, 6) * 40 }}
    >
      <Pressable
        onPress={onPress}
        className="border-border/40 border-b px-6 py-5 active:bg-muted/30"
      >
      <View
        className="flex-row flex-wrap items-center gap-x-2 gap-y-1"
      >
        <Avatar uri={item.host.avatarUrl} size={HOST_AVATAR_SIZE} />
        <SentenceText className="text-primary">
          @{item.host.username}
        </SentenceText>
        <SentenceText>wants to</SentenceText>
        <SentenceText>{item.emoji}</SentenceText>
        <SentenceText className="font-bold">{item.title}</SentenceText>
        {relativeDateUsesOnConnector(date) ? (
          <SentenceText>on</SentenceText>
        ) : null}
        <SentenceText className="text-primary">
          {formatRelativeDateTime(date)}
        </SentenceText>
        <SentenceText>at</SentenceText>
        <Pressable onPress={openPlaceView} hitSlop={6}>
          <SentenceText className="text-primary underline">
            {item.place.name}
          </SentenceText>
        </Pressable>
        <SentenceText>with</SentenceText>
        <SentenceText className="text-primary">{item.capacity}</SentenceText>
        <SentenceText className="text-primary">
          {GENDER_LABEL[item.genderPreference]}
        </SentenceText>
      </View>

      <View className="mt-4 flex-row items-center gap-3">
        <AvatarStack
          uris={goingAvatars}
          size={STACK_AVATAR_SIZE}
          overlap={STACK_OVERLAP}
          overflow={overflow}
        />
        <Text
          className="text-muted-foreground flex-1 text-sm"
          numberOfLines={1}
        >
          {item.goingCount} going · {formatDistance(item.distanceKm)}
        </Text>
        <Button onPress={onJoinPress} size="sm">
          <Text>join</Text>
        </Button>
      </View>
    </Pressable>
    </MotiView>
  );
}

function SentenceText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={cn('text-foreground font-medium', className)}
      style={{ fontSize: SENTENCE_FONT_SIZE, lineHeight: SENTENCE_LINE_HEIGHT }}
    >
      {children}
    </Text>
  );
}

function Avatar({ uri, size }: { uri: string; size: number }) {
  return (
    <Image
      source={{ uri }}
      className="bg-muted"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}

interface AvatarStackProps {
  uris: string[];
  size: number;
  overlap: number;
  overflow: number;
}

function AvatarStack({ uris, size, overlap, overflow }: AvatarStackProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const ringColor = colors.background;

  return (
    <View className="flex-row items-center">
      {uris.map((uri, i) => (
        <Image
          key={`${uri}-${i}`}
          source={{ uri }}
          className="bg-muted"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: i === 0 ? 0 : -overlap,
            borderWidth: 2,
            borderColor: ringColor,
          }}
        />
      ))}
      {overflow > 0 ? (
        <View
          className="bg-muted items-center justify-center"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: -overlap,
            borderWidth: 2,
            borderColor: ringColor,
          }}
        >
          <Text className="text-muted-foreground text-xs font-semibold">
            +{overflow}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  if (km < 10) return `${km.toFixed(1)}km`;
  return `${Math.round(km)}km`;
}
