import { Text } from '@/components/ui/text';
import type { PickedPlace } from '@/features/places/types';
import * as React from 'react';
import { Pill, usePillTextStyle } from './Pill';

interface PlaceFieldProps {
  value: PickedPlace | null;
  onPress: () => void;
}

export function PlaceField({ value, onPress }: PlaceFieldProps) {
  const filled = !!value;
  const textStyle = usePillTextStyle(filled);

  return (
    <Pill filled={filled} onPress={onPress}>
      <Text numberOfLines={1} style={textStyle}>
        {value?.name ?? 'where'}
      </Text>
    </Pill>
  );
}
