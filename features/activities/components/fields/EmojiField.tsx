import { cn } from '@/lib/utils';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable, Text } from 'react-native';
import { EmojiSheet } from '../EmojiSheet';

interface EmojiFieldProps {
  value: string | null;
  onChange: (value: string) => void;
}

/**
 * Self-contained emoji slot — owns its sheet ref. Pressing the slot opens
 * the emoji keyboard sheet; selection commits the value back via onChange.
 */
export function EmojiField({ value, onChange }: EmojiFieldProps) {
  const ref = React.useRef<BottomSheetModal>(null);

  return (
    <>
      <Pressable onPress={() => ref.current?.present()} hitSlop={8}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ fontSize: 28, lineHeight: 38 }}
          className={cn(!value && 'opacity-40')}
        >
          {value ?? '🙂'}
        </Text>
      </Pressable>
      <EmojiSheet ref={ref} onSelect={onChange} />
    </>
  );
}
