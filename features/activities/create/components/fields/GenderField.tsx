import { haptics } from '@/lib/haptics';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Text } from 'react-native';
import type { ActivityGenderPreference } from '../../../types';
import { Pill, pillTextStyle } from './Pill';

interface GenderFieldProps {
  value: ActivityGenderPreference;
  onChange: (value: ActivityGenderPreference) => void;
}

const ORDER: ActivityGenderPreference[] = ['ALL', 'FEMALE', 'MALE'];
const LABEL: Record<ActivityGenderPreference, string> = {
  ALL: 'people',
  FEMALE: 'girls',
  MALE: 'guys',
};

// Always rendered as filled — the default `ALL` is a meaningful value.
export function GenderField({ value, onChange }: GenderFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  const cycle = () => {
    haptics.selection();
    const next = ORDER[(ORDER.indexOf(value) + 1) % ORDER.length];
    onChange(next);
  };

  return (
    <Pill filled onPress={cycle}>
      <Text
        style={[
          pillTextStyle(true, colors),
          { width: 110, textAlign: 'center' },
        ]}
      >
        {LABEL[value]}
      </Text>
    </Pill>
  );
}
