import * as React from 'react';
import { Pressable, Text } from 'react-native';
import {
  PILL_VERTICAL_PADDING,
  pillClassName,
  SLOT_FONT_SIZE,
  SLOT_LINE_HEIGHT,
} from './Pill';

interface EmojiFieldProps {
  value: string | null;
  onPress: () => void;
}

export function EmojiField({ value, onPress }: EmojiFieldProps) {
  const filled = !!value;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className={pillClassName(filled)}
      style={{ paddingVertical: PILL_VERTICAL_PADDING }}
    >
      <Text
        style={{
          fontSize: SLOT_FONT_SIZE,
          lineHeight: SLOT_LINE_HEIGHT,
          opacity: filled ? 1 : 0.55,
        }}
      >
        {value ?? '🙂'}
      </Text>
    </Pressable>
  );
}
