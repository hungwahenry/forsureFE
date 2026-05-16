import { Text } from '@/components/ui/text';
import { Wordmark } from '@/components/ui/wordmark';
import { ACTIVITY_VERB, GENDER_LABEL } from '@/features/activities/labels';
import { FONTS } from '@/lib/fonts';
import {
  formatRelativeDateTime,
  relativeDateUsesOnConnector,
} from '@/lib/format';
import { Image } from 'expo-image';
import * as React from 'react';
import { View } from 'react-native';
import type { ActivityGenderPreference, ActivityStatus } from '../../types';

export const SHARE_CARD_SIZE = 1080;

const COLORS = {
  background: '#FFFFFF',
  ink: '#0D1615',
  inkMuted: '#5B7572',
  primary: '#2EBFB5',
  accent: '#FFA31A',
  avatarBg: '#E5EFEE',
} as const;

const SENTENCE_FONT_SIZE = 60;
const SENTENCE_LINE_HEIGHT = 84;
const AVATAR_SIZE = 80;
const CARD_PADDING = 96;

export interface SharableActivity {
  id: string;
  emoji: string;
  title: string;
  startsAt: string;
  place: { name: string };
  capacity: number;
  participantCount: number;
  genderPreference: ActivityGenderPreference;
  status: ActivityStatus;
  host: { username: string; displayName: string; avatarUrl: string };
}

interface Props {
  activity: SharableActivity;
}

export const ActivityShareCard = React.forwardRef<View, Props>(
  function ActivityShareCard({ activity }, ref) {
    return (
      <View
        ref={ref}
        collapsable={false}
        style={{
          width: SHARE_CARD_SIZE,
          height: SHARE_CARD_SIZE,
          backgroundColor: COLORS.background,
          padding: CARD_PADDING,
          overflow: 'hidden',
        }}
      >
        <Backdrop />

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Sentence activity={activity} />
        </View>

        <Footer />
      </View>
    );
  },
);

function Sentence({ activity }: { activity: SharableActivity }) {
  const date = new Date(activity.startsAt);
  const dateLabel = formatRelativeDateTime(date);
  const usesOn = relativeDateUsesOnConnector(date);
  const genderLabel = GENDER_LABEL[activity.genderPreference];

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 14,
        rowGap: 16,
      }}
    >
      <Image
        source={{ uri: activity.host.avatarUrl }}
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: AVATAR_SIZE / 2,
          backgroundColor: COLORS.avatarBg,
        }}
        contentFit="cover"
      />
      <Word color={COLORS.primary}>@{activity.host.username}</Word>
      <Word>{ACTIVITY_VERB[activity.status]}</Word>
      <Word>{activity.emoji}</Word>
      <Word bold>{activity.title}</Word>
      {usesOn ? <Word>on</Word> : null}
      <Word color={COLORS.primary}>{dateLabel}</Word>
      <Word>at</Word>
      <Word color={COLORS.primary}>{activity.place.name}</Word>
      <Word>with</Word>
      <Word color={COLORS.primary}>{activity.capacity}</Word>
      <Word color={COLORS.primary}>{genderLabel}</Word>
    </View>
  );
}

interface WordProps {
  children: React.ReactNode;
  bold?: boolean;
  color?: string;
}

function Word({ children, bold, color }: WordProps) {
  return (
    <Text
      style={{
        fontFamily: bold ? FONTS.bold : FONTS.medium,
        fontSize: SENTENCE_FONT_SIZE,
        lineHeight: SENTENCE_LINE_HEIGHT,
        color: color ?? COLORS.ink,
      }}
    >
      {children}
    </Text>
  );
}

function Footer() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        marginTop: 32,
      }}
    >
      <Wordmark height={52} />
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: 30,
          lineHeight: 40,
          color: COLORS.inkMuted,
        }}
      >
        forsure.fyi
      </Text>
    </View>
  );
}

function Backdrop() {
  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -300,
          right: -260,
          width: 720,
          height: 720,
          borderRadius: 360,
          backgroundColor: COLORS.primary,
          opacity: 0.12,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: -240,
          left: -220,
          width: 600,
          height: 600,
          borderRadius: 300,
          backgroundColor: COLORS.accent,
          opacity: 0.1,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: COLORS.primary,
          opacity: 0.85,
        }}
      />
    </>
  );
}
