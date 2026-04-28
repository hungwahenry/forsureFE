import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, TextInput, View } from 'react-native';

interface InputProps extends React.ComponentProps<typeof TextInput> {
  /** Element rendered to the left of the input (e.g. an icon or "@"). */
  leftIcon?: React.ReactNode;
  /** Element rendered to the right of the input (e.g. an eye toggle, clear button). */
  rightIcon?: React.ReactNode;
  /** Tailwind classes applied to the wrapper when `leftIcon`/`rightIcon` are set. */
  containerClassName?: string;
  ref?: React.Ref<TextInput>;
}

function Input({
  className,
  containerClassName,
  leftIcon,
  rightIcon,
  ref,
  ...props
}: InputProps) {
  const hasAdornment = leftIcon != null || rightIcon != null;

  // Standalone path: no wrapper added — TextInput keeps its existing role
  // for callers that don't need icons.
  if (!hasAdornment) {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-full border px-4 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({
                web: 'disabled:pointer-events-none disabled:cursor-not-allowed',
              })
            ),
          Platform.select({
            web: cn(
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            ),
            native: 'placeholder:text-muted-foreground/50',
          }),
          className
        )}
        {...props}
      />
    );
  }

  // Adorned path: wrapper holds the border / bg / radius; TextInput goes flat.
  return (
    <View
      className={cn(
        'dark:bg-input/30 border-input bg-background flex h-10 w-full min-w-0 flex-row items-center gap-2 rounded-full border px-4 shadow-sm shadow-black/5 sm:h-9',
        props.editable === false && 'opacity-50',
        containerClassName
      )}
    >
      {leftIcon ? (
        <View className="text-muted-foreground shrink-0">{leftIcon}</View>
      ) : null}
      <TextInput
        ref={ref}
        className={cn(
          'text-foreground h-full flex-1 bg-transparent text-base leading-5',
          Platform.select({
            web: cn(
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none md:text-sm'
            ),
            native: 'placeholder:text-muted-foreground/50',
          }),
          className
        )}
        {...props}
      />
      {rightIcon ? (
        <View className="text-muted-foreground shrink-0">{rightIcon}</View>
      ) : null}
    </View>
  );
}

export { Input };
export type { InputProps };
