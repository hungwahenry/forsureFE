import { FONTS } from '@/lib/fonts';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import {
  ACTIVITY_CAPACITY_MAX,
  ACTIVITY_CAPACITY_MIN,
  clampCapacity,
  sanitizeCapacityInput,
} from '../../validation/schemas';
import {
  PILL_VERTICAL_PADDING,
  pillClassName,
  usePillSizing,
} from './Pill';

interface CapacityFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function CapacityField({ value, onChange }: CapacityFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const { fontSize, lineHeight } = usePillSizing();

  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const onChangeText = (next: string) => {
    setDraft(sanitizeCapacityInput(next));
  };

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!Number.isFinite(n)) {
      setDraft(String(value));
      return;
    }
    const clamped = clampCapacity(n);
    onChange(clamped);
    setDraft(String(clamped));
  };

  return (
    <View
      className={pillClassName(true)}
      style={{ paddingVertical: PILL_VERTICAL_PADDING }}
    >
      <TextInput
        value={draft}
        onChangeText={onChangeText}
        onBlur={commit}
        onSubmitEditing={commit}
        keyboardType="number-pad"
        maxLength={2}
        returnKeyType="done"
        selectTextOnFocus
        style={{
          color: colors.primary,
          fontSize,
          lineHeight,
          fontFamily: FONTS.semibold,
          padding: 0,
          minWidth: 32,
          textAlign: 'center',
        }}
      />
    </View>
  );
}
