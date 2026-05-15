import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, type DimensionValue } from 'react-native';

function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/thumbs/png?seed=${seed}&size=96`;
}

interface CollageCard {
  user: string;
  emoji: string;
  activity: string;
  place: string;
  top: DimensionValue;
  left: DimensionValue;
  rotate: string;
  scale: number;
}

const CARDS: CollageCard[] = [
  { user: 'maya', emoji: '☕', activity: 'grab coffee', place: 'blue bottle', top: '8%', left: '-9%', rotate: '-7deg', scale: 0.96 },

  { user: 'theo', emoji: '🎾', activity: 'play tennis', place: 'the courts', top: '13%', left: '22%', rotate: '6deg', scale: 0.9 },

  { user: 'leo', emoji: '🌆', activity: 'watch the sunset', place: 'victoria island', top: '7%', left: '52%', rotate: '-5deg', scale: 0.91 },

  { user: 'ana', emoji: '🎬', activity: 'catch a movie', place: 'the rooftop', top: '29%', left: '-7%', rotate: '3deg', scale: 1 },

  { user: 'jules', emoji: '🥾', activity: 'go for a hike', place: 'eagle trail', top: '34%', left: '24%', rotate: '-6deg', scale: 0.92 },

  { user: 'zara', emoji: '🍣', activity: 'try sushi', place: 'tokyo table', top: '28%', left: '53%', rotate: '7deg', scale: 0.95 },

  { user: 'sam', emoji: '🍜', activity: 'get ramen', place: 'ippudo', top: '58%', left: '-8%', rotate: '8deg', scale: 0.88 },

  { user: 'noor', emoji: '🎨', activity: 'try pottery', place: 'the studio', top: '63%', left: '23%', rotate: '-4deg', scale: 0.94 },

  { user: 'kai', emoji: '🎮', activity: 'visit an arcade', place: 'pixel hub', top: '57%', left: '52%', rotate: '-8deg', scale: 0.9 },

  { user: 'nina', emoji: '🛶', activity: 'go on a boat ride', place: 'lagos lagoon', top: '80%', left: '20%', rotate: '5deg', scale: 0.93 },
];

function Piece({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={cn('text-muted-foreground text-base', className)}
      style={{ lineHeight: 22 }}
    >
      {children}
    </Text>
  );
}

function ActivityCard({ card }: { card: CollageCard }) {
  return (
    <View
      className="bg-card border-border rounded-3xl border p-4"
      style={{
        width: 234,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      }}
    >
      <View className="flex-row flex-wrap items-center gap-x-1.5 gap-y-1">
        <Image
          source={{ uri: avatarUrl(card.user) }}
          style={{ width: 28, height: 28, borderRadius: 14 }}
          className="bg-muted"
        />
        <Piece className="text-primary font-medium">@{card.user}</Piece>
        <Piece>wants to</Piece>
        <Piece>{card.emoji}</Piece>
        <Piece className="text-foreground font-semibold">
          {card.activity}
        </Piece>
        <Piece>at</Piece>
        <Piece className="text-primary">{card.place}</Piece>
      </View>
    </View>
  );
}

function FloatingCard({ card, index }: { card: CollageCard; index: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: card.top,
        left: card.left,
        transform: [{ rotate: card.rotate }, { scale: card.scale }],
      }}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 480, delay: 180 + index * 110 }}
      >
        <MotiView
          from={{ translateY: -5 }}
          animate={{ translateY: 5 }}
          transition={{
            loop: true,
            repeatReverse: true,
            type: 'timing',
            duration: 2600 + index * 320,
          }}
        >
          <ActivityCard card={card} />
        </MotiView>
      </MotiView>
    </View>
  );
}

export function WelcomeCollage() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const bg = THEME[scheme].background;
  const bgTransparent =
    scheme === 'dark' ? 'rgba(13,18,21,0)' : 'rgba(255,255,255,0)';

  return (
    <View className="flex-1 overflow-hidden">
      {CARDS.map((card, i) => (
        <FloatingCard key={card.user} card={card} index={i} />
      ))}
      <LinearGradient
        colors={[bgTransparent, bg] as const}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '42%',
        }}
        pointerEvents="none"
      />
    </View>
  );
}
