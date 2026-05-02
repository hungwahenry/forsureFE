import { Text } from '@/components/ui/text';
import { relativeDateUsesOnConnector } from '@/lib/format';
import * as React from 'react';
import { View } from 'react-native';
import type { PickedPlace } from '@/features/places/types';
import { CapacityField } from './fields/CapacityField';
import { DateTimeField } from './fields/DateTimeField';
import { EmojiField } from './fields/EmojiField';
import { GenderField } from './fields/GenderField';
import {
  usePillSizing,
} from './fields/Pill';
import { PlaceField } from './fields/PlaceField';
import { TitleField } from './fields/TitleField';
import type { ActivityGenderPreference } from '../types';

interface SentenceDraft {
  title: string;
  emoji: string | null;
  startsAt: Date | null;
  place: PickedPlace | null;
  capacity: number;
  genderPreference: ActivityGenderPreference;
}

interface ActivitySentenceProps {
  draft: SentenceDraft;
  onTitleChange: (value: string) => void;
  onEmojiPress: () => void;
  onDatePress: () => void;
  onPlacePress: () => void;
  onCapacityChange: (value: number) => void;
  onGenderChange: (value: ActivityGenderPreference) => void;
  genderLocked?: boolean;
}

export function ActivitySentence({
  draft,
  onTitleChange,
  onEmojiPress,
  onDatePress,
  onPlacePress,
  onCapacityChange,
  onGenderChange,
  genderLocked,
}: ActivitySentenceProps) {
  const showOnConnector =
    draft.startsAt === null || relativeDateUsesOnConnector(draft.startsAt);

  return (
    <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1.5">
      <Word>i want to</Word>
      <TitleField value={draft.title} onChange={onTitleChange} />
      <EmojiField value={draft.emoji} onPress={onEmojiPress} />
      {showOnConnector ? <Word>on</Word> : null}
      <DateTimeField value={draft.startsAt} onPress={onDatePress} />
      <Word>at</Word>
      <PlaceField value={draft.place} onPress={onPlacePress} />
      <Word>with</Word>
      <CapacityField value={draft.capacity} onChange={onCapacityChange} />
      <GenderField
        value={draft.genderPreference}
        onChange={onGenderChange}
        disabled={genderLocked}
      />
    </View>
  );
}

function Word({ children }: { children: React.ReactNode }) {
  const { fontSize, lineHeight } = usePillSizing();
  return (
    <Text
      className="text-foreground font-medium"
      style={{ fontSize, lineHeight }}
    >
      {children}
    </Text>
  );
}
