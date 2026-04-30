import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable } from 'react-native';

interface PillProps {
  filled: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

// Shared sizing for pill text + adjacent static `<Word>`s so they align on the same line.
export const SLOT_FONT_SIZE = 28;
export const SLOT_LINE_HEIGHT = 34;
export const PILL_VERTICAL_PADDING = 7;
export const SLOT_ROW_HEIGHT = SLOT_LINE_HEIGHT + PILL_VERTICAL_PADDING * 2;

/** Shared chrome classes for any pill (Pressable wrapper, View wrapper, etc). */
export function pillClassName(filled: boolean): string {
  return cn(
    'rounded-full px-4',
    filled ? 'bg-primary/15' : 'bg-muted-foreground/[0.18]',
  );
}

export function Pill({ filled, onPress, children }: PillProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className={pillClassName(filled)}
      style={{ paddingVertical: PILL_VERTICAL_PADDING }}
    >
      {children}
    </Pressable>
  );
}

export function pillTextStyle(filled: boolean, colors: typeof THEME.light) {
  return {
    color: filled ? colors.primary : colors.mutedForeground,
    fontSize: SLOT_FONT_SIZE,
    lineHeight: SLOT_LINE_HEIGHT,
    fontWeight: '600' as const,
  };
}
