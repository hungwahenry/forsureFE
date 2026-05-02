import { FONTS } from '@/lib/fonts';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { ACTIVITY_TITLE_MAX } from '../../validation/schemas';
import {
  PILL_VERTICAL_PADDING,
  pillClassName,
  usePillSizing,
} from './Pill';

interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

// Base width at 390pt design width. Scales proportionally on smaller screens.
const BASE_WIDTH = 130;

export function TitleField({ value, onChange }: TitleFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const filled = value.trim().length > 0;
  const { fontSize, lineHeight, scale } = usePillSizing();

  return (
    <View
      className={pillClassName(filled)}
      style={{ paddingVertical: PILL_VERTICAL_PADDING }}
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="do stuff"
        placeholderTextColor={colors.mutedForeground}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={ACTIVITY_TITLE_MAX}
        returnKeyType="done"
        style={{
          color: filled ? colors.primary : colors.mutedForeground,
          fontSize,
          lineHeight,
          fontFamily: FONTS.semibold,
          padding: 0,
          width: Math.round(BASE_WIDTH * scale),
        }}
      />
    </View>
  );
}
