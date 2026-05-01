import { formatRelativeDateTime } from '@/lib/format';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Text } from 'react-native';
import { Pill, pillTextStyle } from './Pill';

interface DateTimeFieldProps {
  value: Date | null;
  onPress: () => void;
}

export function DateTimeField({ value, onPress }: DateTimeFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const filled = !!value;

  return (
    <Pill filled={filled} onPress={onPress}>
      <Text style={pillTextStyle(filled, colors)}>
        {filled ? formatRelativeDateTime(value!) : 'when'}
      </Text>
    </Pill>
  );
}
