import { THEME } from '@/lib/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ACTIVITY_TITLE_MAX } from '../../validation/schemas';

interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/** Inline TextInput for the activity title — always editable. */
export function TitleField({ value, onChange }: TitleFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <BottomSheetTextInput
      value={value}
      onChangeText={onChange}
      placeholder="activity"
      placeholderTextColor={colors.mutedForeground}
      autoCapitalize="none"
      autoCorrect={false}
      maxLength={ACTIVITY_TITLE_MAX}
      returnKeyType="done"
      style={{
        color: value.length > 0 ? colors.primary : colors.mutedForeground,
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 38,
        padding: 0,
        minWidth: 110,
        flexGrow: 1,
        flexShrink: 1,
      }}
    />
  );
}
