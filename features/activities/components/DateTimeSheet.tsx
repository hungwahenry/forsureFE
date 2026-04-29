import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { MIN_LEAD_TIME_MS } from '@/features/activities/validation/schemas';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Platform, View } from 'react-native';

interface DateTimeSheetProps {
  initialValue: Date | null;
  onSubmit: (value: Date) => void;
}

const DEFAULT_LEAD_HOURS = 2;

export const DateTimeSheet = React.forwardRef<
  BottomSheetModal,
  DateTimeSheetProps
>(function DateTimeSheet({ initialValue, onSubmit }, ref) {
  const [value, setValue] = React.useState<Date>(() => {
    if (initialValue) return initialValue;
    const d = new Date();
    d.setHours(d.getHours() + DEFAULT_LEAD_HOURS);
    return d;
  });

  React.useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  const minDate = React.useMemo(
    () => new Date(Date.now() + MIN_LEAD_TIME_MS),
    [],
  );

  const onChange = (_e: DateTimePickerEvent, picked?: Date) => {
    if (picked) setValue(picked);
  };

  const submit = () => {
    if (value.getTime() < Date.now() + MIN_LEAD_TIME_MS) return;
    onSubmit(value);
    (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
  };

  const tooSoon = value.getTime() < Date.now() + MIN_LEAD_TIME_MS;

  return (
    <BottomSheet ref={ref} snapPoints={['55%']} enableDynamicSizing={false}>
      <View className="flex-1 gap-4 px-6 pt-2">
        <Text className="text-foreground text-xl font-bold">when?</Text>
        <View className="bg-muted/30 items-center rounded-2xl py-2">
          <DateTimePicker
            value={value}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={minDate}
            onChange={onChange}
          />
        </View>
        {tooSoon ? (
          <Text className="text-destructive text-sm">
            must be at least 30 minutes from now.
          </Text>
        ) : null}
        <Button onPress={submit} disabled={tooSoon} size="lg">
          <Text>done</Text>
        </Button>
      </View>
    </BottomSheet>
  );
});
