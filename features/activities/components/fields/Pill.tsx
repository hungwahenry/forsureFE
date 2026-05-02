import { FONTS } from '@/lib/fonts';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';

interface PillProps {
  filled: boolean;
  onPress?: () => void;
  disabled?: boolean;
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

export function Pill({ filled, onPress, disabled, children }: PillProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      disabled={disabled}
      className={cn(pillClassName(filled), disabled && 'opacity-40')}
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
    fontFamily: FONTS.semibold,
  };
}

/** Returns fontSize/lineHeight scaled to the current screen width. */
export function usePillSizing() {
  const { width } = useWindowDimensions();
  // Scale down on narrow screens (320pt SE), cap at design width (390pt).
  const scale = Math.max(0.8, Math.min(1.0, width / 390));
  return {
    fontSize: Math.round(SLOT_FONT_SIZE * scale),
    lineHeight: Math.round(SLOT_LINE_HEIGHT * scale),
    scale,
  };
}

/** Returns a text style object for pill labels, responsive to screen width. */
export function usePillTextStyle(filled: boolean) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const { fontSize, lineHeight } = usePillSizing();
  return {
    color: filled ? colors.primary : colors.mutedForeground,
    fontSize,
    lineHeight,
    fontFamily: FONTS.semibold,
  };
}
