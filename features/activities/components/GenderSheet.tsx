import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import type { ActivityGenderPreference } from '../types';

interface GenderSheetProps {
  initialValue: ActivityGenderPreference;
  onSubmit: (value: ActivityGenderPreference) => void;
}

const OPTIONS: {
  value: ActivityGenderPreference;
  label: string;
  hint: string;
}[] = [
  { value: 'ALL', label: 'people', hint: 'open to everyone' },
  { value: 'FEMALE', label: 'girls', hint: 'female only' },
  { value: 'MALE', label: 'guys', hint: 'male only' },
];

export const GenderSheet = React.forwardRef<
  BottomSheetModal,
  GenderSheetProps
>(function GenderSheet({ initialValue, onSubmit }, ref) {
  const onPick = (value: ActivityGenderPreference) => {
    haptics.selection();
    onSubmit(value);
    (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
  };

  return (
    <BottomSheet ref={ref} snapPoints={['42%']} enableDynamicSizing={false}>
      <View className="flex-1 gap-3 px-6 pt-2">
        <Text className="text-foreground mb-2 text-xl font-bold">
          who can join?
        </Text>
        {OPTIONS.map((opt) => {
          const active = opt.value === initialValue;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onPick(opt.value)}
              className={cn(
                'rounded-2xl border-2 px-5 py-4',
                active
                  ? 'border-primary bg-primary/5'
                  : 'border-foreground/15 bg-muted/40',
              )}
            >
              <Text
                className={cn(
                  'text-base font-semibold',
                  active ? 'text-primary' : 'text-foreground',
                )}
              >
                {opt.label}
              </Text>
              <Text className="text-muted-foreground text-sm">{opt.hint}</Text>
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
});
