import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import * as React from 'react';
import { GENDER_LABEL } from '../../labels';
import type { ActivityGenderPreference } from '../../types';
import { Pill, usePillSizing, usePillTextStyle } from './Pill';

interface GenderFieldProps {
  value: ActivityGenderPreference;
  onChange: (value: ActivityGenderPreference) => void;
  disabled?: boolean;
}

const ORDER: ActivityGenderPreference[] = ['ALL', 'FEMALE', 'MALE'];

// Always rendered as filled — the default `ALL` is a meaningful value.
export function GenderField({ value, onChange, disabled }: GenderFieldProps) {
  const textStyle = usePillTextStyle(true);
  const { scale } = usePillSizing();

  const cycle = () => {
    if (disabled) return;
    haptics.selection();
    const next = ORDER[(ORDER.indexOf(value) + 1) % ORDER.length];
    onChange(next);
  };

  return (
    <Pill filled onPress={cycle} disabled={disabled}>
      <Text
        style={[textStyle, { width: Math.round(110 * scale), textAlign: 'center' }]}
      >
        {GENDER_LABEL[value]}
      </Text>
    </Pill>
  );
}
