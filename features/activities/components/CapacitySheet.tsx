import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { Add, Minus } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  ACTIVITY_CAPACITY_MAX,
  ACTIVITY_CAPACITY_MIN,
} from '../validation/schemas';

interface CapacitySheetProps {
  initialValue: number;
  onSubmit: (value: number) => void;
}

export const CapacitySheet = React.forwardRef<
  BottomSheetModal,
  CapacitySheetProps
>(function CapacitySheet({ initialValue, onSubmit }, ref) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => setValue(initialValue), [initialValue]);

  const dec = () => {
    if (value <= ACTIVITY_CAPACITY_MIN) return;
    haptics.tap();
    setValue((v) => Math.max(ACTIVITY_CAPACITY_MIN, v - 1));
  };
  const inc = () => {
    if (value >= ACTIVITY_CAPACITY_MAX) return;
    haptics.tap();
    setValue((v) => Math.min(ACTIVITY_CAPACITY_MAX, v + 1));
  };

  const submit = () => {
    onSubmit(value);
    (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
  };

  const decDisabled = value <= ACTIVITY_CAPACITY_MIN;
  const incDisabled = value >= ACTIVITY_CAPACITY_MAX;

  return (
    <BottomSheet ref={ref} snapPoints={['38%']} enableDynamicSizing={false}>
      <View className="flex-1 items-center gap-6 px-6 pt-2">
        <Text className="text-foreground text-xl font-bold">how many?</Text>
        <View className="flex-row items-center gap-8">
          <Pressable
            onPress={dec}
            disabled={decDisabled}
            hitSlop={12}
            className={cn(
              'border-foreground/15 size-14 items-center justify-center rounded-full border-2',
              decDisabled && 'opacity-40',
            )}
          >
            <Icon as={Minus} className="text-foreground size-6" />
          </Pressable>
          <Text className="text-foreground text-6xl font-bold">{value}</Text>
          <Pressable
            onPress={inc}
            disabled={incDisabled}
            hitSlop={12}
            className={cn(
              'border-foreground/15 size-14 items-center justify-center rounded-full border-2',
              incDisabled && 'opacity-40',
            )}
          >
            <Icon as={Add} className="text-foreground size-6" />
          </Pressable>
        </View>
        <Button onPress={submit} size="lg" className="w-full">
          <Text>done</Text>
        </Button>
      </View>
    </BottomSheet>
  );
});
