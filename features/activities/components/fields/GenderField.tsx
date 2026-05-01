import { haptics } from '@/lib/haptics';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Text } from 'react-native';
import { GENDER_LABEL } from '../../labels';
import type { ActivityGenderPreference } from '../../types';
import { Pill, pillTextStyle } from './Pill';

interface GenderFieldProps {
  value: ActivityGenderPreference;
  onChange: (value: ActivityGenderPreference) => void;
  disabled?: boolean;
}

const ORDER: ActivityGenderPreference[] = ['ALL', 'FEMALE', 'MALE'];

// Always rendered as filled — the default `ALL` is a meaningful value.
export function GenderField({ value, onChange, disabled }: GenderFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  const cycle = () => {
    if (disabled) return;
    haptics.selection();
    const next = ORDER[(ORDER.indexOf(value) + 1) % ORDER.length];
    onChange(next);
  };

  return (
    <Pill filled onPress={cycle} disabled={disabled}>
      <Text
        style={[
          pillTextStyle(true, colors),
          { width: 110, textAlign: 'center' },
        ]}
      >
        {GENDER_LABEL[value]}
      </Text>
    </Pill>
  );
}
