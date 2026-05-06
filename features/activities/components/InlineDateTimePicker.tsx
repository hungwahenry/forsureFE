import { Text } from '@/components/ui/text';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { MIN_LEAD_TIME_MS } from '../validation/schemas';

interface InlineDateTimePickerProps {
  value: Date | null;
  onChange: (value: Date) => void;
  open: boolean;
  onClose: () => void;
}

const DEFAULT_LEAD_HOURS = 2;

export function InlineDateTimePicker({
  value,
  onChange,
  open,
  onClose,
}: InlineDateTimePickerProps) {
  const minDate = React.useMemo(
    () => new Date(Date.now() + MIN_LEAD_TIME_MS),
    [],
  );
  const defaultValue = React.useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + DEFAULT_LEAD_HOURS);
    return d;
  }, []);

  const [androidStep, setAndroidStep] = React.useState<'date' | 'time'>('date');
  const pendingDateRef = React.useRef<Date | null>(null);

  // Reset step whenever the picker is opened.
  React.useEffect(() => {
    if (open) setAndroidStep('date');
  }, [open]);

  if (!open) return null;

  if (Platform.OS === 'android') {
    const handleAndroidChange = (event: DateTimePickerEvent, picked?: Date) => {
      if (event.type === 'dismissed') {
        onClose();
        return;
      }
      if (!picked) return;

      if (androidStep === 'date') {
        // Store the chosen date and move to time step without closing.
        pendingDateRef.current = picked;
        setAndroidStep('time');
      } else {
        // Merge the previously chosen date with the chosen time.
        const base = pendingDateRef.current ?? picked;
        const combined = new Date(base);
        combined.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
        onChange(combined);
        onClose();
      }
    };

    return (
      <DateTimePicker
        value={value ?? defaultValue}
        mode={androidStep}
        display="default"
        minimumDate={androidStep === 'date' ? minDate : undefined}
        onChange={handleAndroidChange}
      />
    );
  }

  const handleChange = (_event: DateTimePickerEvent, picked?: Date) => {
    if (picked) onChange(picked);
  };

  return (
    <View className="bg-muted/30 mb-4 items-center rounded-2xl py-2">
      <DateTimePicker
        value={value ?? defaultValue}
        mode="datetime"
        display="spinner"
        minimumDate={minDate}
        onChange={handleChange}
      />
      <Pressable onPress={onClose} hitSlop={8} className="px-4 py-1">
        <Text className="text-primary font-semibold">done</Text>
      </Pressable>
    </View>
  );
}
