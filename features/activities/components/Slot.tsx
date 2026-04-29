import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface SlotProps {
  /** What the user has filled in. `null`/empty renders the placeholder. */
  value: string | null | undefined;
  /** Hint shown when empty (e.g. "activity", "when", "where"). */
  placeholder: string;
  onPress: () => void;
  /** Tailwind classes appended to the inner text. */
  className?: string;
}

/**
 * One slot in the mad-libs sentence — tappable inline text. Empty slots show
 * the placeholder in muted-foreground; filled slots use the primary color so
 * the eye reads the sentence as "fill in the blanks".
 */
export function Slot({ value, placeholder, onPress, className }: SlotProps) {
  const filled = value != null && value !== '';
  return (
    <Text
      onPress={onPress}
      className={cn(
        'font-semibold',
        filled
          ? 'text-primary'
          : 'text-muted-foreground underline decoration-muted-foreground/50',
        className,
      )}
    >
      {filled ? value : placeholder}
    </Text>
  );
}
