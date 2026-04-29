import { BottomSheet } from '@/components/ui/bottom-sheet';
import { THEME } from '@/lib/theme';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard';

interface EmojiSheetProps {
  onSelect: (emoji: string) => void;
}

export const EmojiSheet = React.forwardRef<BottomSheetModal, EmojiSheetProps>(
  function EmojiSheet({ onSelect }, ref) {
    const { colorScheme } = useColorScheme();
    const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

    const onPick = (emoji: EmojiType) => {
      onSelect(emoji.emoji);
      (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
    };

    return (
      <BottomSheet ref={ref} snapPoints={['65%']} enableDynamicSizing={false}>
        <View className="flex-1">
          <EmojiPicker
            open
            onClose={() => undefined}
            onEmojiSelected={onPick}
            disabledCategories={['flags']}
            theme={{
              backdrop: 'transparent',
              knob: colors.mutedForeground,
              container: colors.card,
              header: colors.foreground,
              skinTonesContainer: colors.muted,
              category: {
                icon: colors.mutedForeground,
                iconActive: colors.primary,
                container: colors.muted,
                containerActive: colors.primary,
              },
              search: {
                background: colors.muted,
                text: colors.foreground,
                placeholder: colors.mutedForeground,
                icon: colors.mutedForeground,
              },
            }}
            styles={{
              container: { backgroundColor: 'transparent' },
            }}
          />
        </View>
      </BottomSheet>
    );
  },
);
