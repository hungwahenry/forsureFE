import { Text } from '@/components/ui/text';
import { formatRelativeDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable } from 'react-native';
import { DateTimeSheet } from '../DateTimeSheet';

interface DateTimeFieldProps {
  value: Date | null;
  onChange: (value: Date) => void;
}

export function DateTimeField({ value, onChange }: DateTimeFieldProps) {
  const ref = React.useRef<BottomSheetModal>(null);
  const filled = !!value;

  return (
    <>
      <Pressable onPress={() => ref.current?.present()} hitSlop={8}>
        <Text
          className={cn(
            'text-3xl font-semibold',
            filled
              ? 'text-primary'
              : 'text-muted-foreground underline decoration-muted-foreground/50',
          )}
        >
          {filled ? formatRelativeDateTime(value!) : 'when'}
        </Text>
      </Pressable>
      <DateTimeSheet ref={ref} initialValue={value} onSubmit={onChange} />
    </>
  );
}
