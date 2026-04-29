import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import {
  BottomSheetTextInput,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';
import { ACTIVITY_TITLE_MAX } from '../validation/schemas';

interface TitleSheetProps {
  initialValue: string;
  onSubmit: (value: string) => void;
}

export const TitleSheet = React.forwardRef<BottomSheetModal, TitleSheetProps>(
  function TitleSheet({ initialValue, onSubmit }, ref) {
    const { colorScheme } = useColorScheme();
    const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

    const [value, setValue] = React.useState(initialValue);

    // Re-seed on present so reopening shows the latest draft value.
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    const submit = () => {
      const trimmed = value.trim();
      if (!trimmed) return;
      onSubmit(trimmed);
      (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
    };

    return (
      <BottomSheet ref={ref} snapPoints={['38%']} enableDynamicSizing={false}>
        <View className="flex-1 gap-6 px-6 pt-2">
          <Text className="text-foreground text-xl font-bold">
            what do you want to do?
          </Text>
          <View className="border-foreground/15 bg-muted/40 h-12 flex-row items-center rounded-full border-2 px-4">
            <BottomSheetTextInput
              autoFocus
              placeholder="watch the new wicked"
              placeholderTextColor={colors.mutedForeground}
              value={value}
              onChangeText={setValue}
              maxLength={ACTIVITY_TITLE_MAX}
              returnKeyType="done"
              onSubmitEditing={submit}
              style={{ flex: 1, color: colors.foreground, fontSize: 16 }}
            />
          </View>
          <Button onPress={submit} disabled={!value.trim()} size="lg">
            <Text>done</Text>
          </Button>
        </View>
      </BottomSheet>
    );
  },
);
