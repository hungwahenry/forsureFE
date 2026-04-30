import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import {
  ACTIVITY_CAPACITY_MAX,
  ACTIVITY_CAPACITY_MIN,
} from '../../validation/schemas';
import {
  PILL_VERTICAL_PADDING,
  pillClassName,
  SLOT_FONT_SIZE,
  SLOT_LINE_HEIGHT,
} from './Pill';

interface CapacityFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function CapacityField({ value, onChange }: CapacityFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const onChangeText = (next: string) => {
    setDraft(next.replace(/\D/g, '').slice(0, 2));
  };

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!Number.isFinite(n)) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.max(
      ACTIVITY_CAPACITY_MIN,
      Math.min(ACTIVITY_CAPACITY_MAX, n),
    );
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
          fontSize: SLOT_FONT_SIZE,
          lineHeight: SLOT_LINE_HEIGHT,
          fontWeight: '600',
          padding: 0,
          minWidth: 32,
          textAlign: 'center',
        }}
      />
    </View>
  );
}
