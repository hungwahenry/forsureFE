import { Text } from '@/components/ui/text';
import { formatRelativeDateTime } from '@/lib/format';
import * as React from 'react';
import { Pill, usePillTextStyle } from './Pill';

interface DateTimeFieldProps {
  value: Date | null;
  onPress: () => void;
}

export function DateTimeField({ value, onPress }: DateTimeFieldProps) {
  const filled = !!value;
  const textStyle = usePillTextStyle(filled);

  return (
    <Pill filled={filled} onPress={onPress}>
      <Text style={textStyle}>
        {filled ? formatRelativeDateTime(value!) : 'when'}
      </Text>
    </Pill>
  );
}
