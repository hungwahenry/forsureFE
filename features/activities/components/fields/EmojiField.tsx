import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable } from 'react-native';
import {
  PILL_VERTICAL_PADDING,
  pillClassName,
  usePillSizing,
} from './Pill';

interface EmojiFieldProps {
  value: string | null;
  onPress: () => void;
}

export function EmojiField({ value, onPress }: EmojiFieldProps) {
  const filled = !!value;
  const { fontSize, lineHeight } = usePillSizing();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className={pillClassName(filled)}
      style={{ paddingVertical: PILL_VERTICAL_PADDING }}
    >
      <Text
        style={{
          fontSize,
          lineHeight,
          opacity: filled ? 1 : 0.55,
        }}
      >
        {value ?? '🙂'}
      </Text>
    </Pressable>
  );
}
