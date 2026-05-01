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

  if (!open) return null;

  const handleChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (Platform.OS === 'android') {
      onClose();
      if (event.type === 'dismissed') return;
    }
    if (picked) onChange(picked);
  };

  if (Platform.OS === 'ios') {
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

  return (
    <DateTimePicker
      value={value ?? defaultValue}
      mode="datetime"
      display="default"
      minimumDate={minDate}
      onChange={handleChange}
    />
  );
}
