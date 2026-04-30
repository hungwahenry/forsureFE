import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { ACTIVITY_TITLE_MAX } from '../../validation/schemas';
import {
  PILL_VERTICAL_PADDING,
  pillClassName,
  SLOT_FONT_SIZE,
  SLOT_LINE_HEIGHT,
} from './Pill';

interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleField({ value, onChange }: TitleFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const filled = value.trim().length > 0;

  return (
    <View
      className={pillClassName(filled)}
      style={{ paddingVertical: PILL_VERTICAL_PADDING }}
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="activity"
        placeholderTextColor={colors.mutedForeground}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={ACTIVITY_TITLE_MAX}
        returnKeyType="done"
        style={{
          color: filled ? colors.primary : colors.mutedForeground,
          fontSize: SLOT_FONT_SIZE,
          lineHeight: SLOT_LINE_HEIGHT,
          fontWeight: '600',
          padding: 0,
          width: 130,
        }}
      />
    </View>
  );
}
