import { Text } from '@/components/ui/text';
import { PlacePicker } from '@/features/places/components/PlacePicker';
import type { PickedPlace } from '@/features/places/types';
import { cn } from '@/lib/utils';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable } from 'react-native';

interface PlaceFieldProps {
  value: PickedPlace | null;
  onChange: (value: PickedPlace) => void;
}

export function PlaceField({ value, onChange }: PlaceFieldProps) {
  const ref = React.useRef<BottomSheetModal>(null);

  return (
    <>
      <Pressable onPress={() => ref.current?.present()} hitSlop={8}>
        <Text
          className={cn(
            'text-3xl font-semibold',
            value
              ? 'text-primary'
              : 'text-muted-foreground underline decoration-muted-foreground/50',
          )}
        >
          {value?.name ?? 'where'}
        </Text>
      </Pressable>
      <PlacePicker ref={ref} onSelect={onChange} />
    </>
  );
}
