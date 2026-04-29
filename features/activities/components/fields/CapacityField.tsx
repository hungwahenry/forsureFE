import { THEME } from '@/lib/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import {
  ACTIVITY_CAPACITY_MAX,
  ACTIVITY_CAPACITY_MIN,
} from '../../validation/schemas';

interface CapacityFieldProps {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Inline numeric input for capacity. Lives in the sentence flow as an
 * always-on TextInput. Clamps to [1, 25] on commit; while typing we just
 * mirror the raw string so users can clear and retype.
 */
export function CapacityField({ value, onChange }: CapacityFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const onChangeText = (next: string) => {
    // Strip non-digits so the input never accepts garbage.
    setDraft(next.replace(/\D/g, '').slice(0, 2));
  };

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!Number.isFinite(n)) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.max(
      ACTIVITY_CAPACITY_MIN,
      Math.min(ACTIVITY_CAPACITY_MAX, n),
    );
    onChange(clamped);
    setDraft(String(clamped));
  };

  return (
    <BottomSheetTextInput
      value={draft}
      onChangeText={onChangeText}
      onBlur={commit}
      onSubmitEditing={commit}
      keyboardType="number-pad"
      maxLength={2}
      returnKeyType="done"
      selectTextOnFocus
      style={{
        color: colors.primary,
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 38,
        padding: 0,
        minWidth: 32,
        textAlign: 'center',
      }}
    />
  );
}
