import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

interface FieldButtonProps extends React.ComponentProps<typeof Pressable> {
  /** Element rendered on the left (e.g. an icon). */
  leftIcon?: React.ReactNode;
  /** Element rendered on the right (e.g. a chevron). */
  rightIcon?: React.ReactNode;
  /** Body content — usually a `<Text />`. */
  children: React.ReactNode;
}

/**
 * A `Pressable` styled to match `Input`'s adorned shell. Use it when a field
 * opens a picker / modal / sheet instead of accepting text directly.
 *
 * @example
 *   <FieldButton onPress={openPicker} leftIcon={<Icon as={Calendar} />}>
 *     <Text>{date ? formatDate(date) : 'tap to choose'}</Text>
 *   </FieldButton>
 */
export function FieldButton({
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: FieldButtonProps) {
  return (
    <Pressable
      className={cn(
        'dark:bg-input/30 border-input bg-background flex h-10 w-full min-w-0 flex-row items-center gap-2 rounded-full border px-4 shadow-sm shadow-black/5 sm:h-9',
        props.disabled && 'opacity-50',
        Platform.select({
          web: cn(
            'transition-colors',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none'
          ),
        }),
        className
      )}
      role="button"
      {...props}
    >
      {leftIcon ? (
        <View className="text-muted-foreground shrink-0">{leftIcon}</View>
      ) : null}
      <View className="flex-1">{children}</View>
      {rightIcon ? (
        <View className="text-muted-foreground shrink-0">{rightIcon}</View>
      ) : null}
    </Pressable>
  );
}
