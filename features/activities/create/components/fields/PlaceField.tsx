import type { PickedPlace } from '@/features/places/types';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Text } from 'react-native';
import { Pill, pillTextStyle } from './Pill';

interface PlaceFieldProps {
  value: PickedPlace | null;
  onPress: () => void;
}

export function PlaceField({ value, onPress }: PlaceFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const filled = !!value;

  return (
    <Pill filled={filled} onPress={onPress}>
      <Text numberOfLines={1} style={pillTextStyle(filled, colors)}>
        {value?.name ?? 'where'}
      </Text>
    </Pill>
  );
}
