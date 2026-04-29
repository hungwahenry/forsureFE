import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import * as React from 'react';
import { Pressable } from 'react-native';
import type { ActivityGenderPreference } from '../../types';

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

/** Inline cycler — tap to advance through people → girls → guys. */
export function GenderField({ value, onChange }: GenderFieldProps) {
  const cycle = () => {
    haptics.selection();
    const next = ORDER[(ORDER.indexOf(value) + 1) % ORDER.length];
    onChange(next);
  };

  return (
    <Pressable onPress={cycle} hitSlop={8}>
      <Text className="text-primary text-3xl font-semibold">
        {LABEL[value]}
      </Text>
    </Pressable>
  );
}
