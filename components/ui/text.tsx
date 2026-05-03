import { FONTS, FONTS_BY_WEIGHT } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text as RNText,
  type StyleProp,
  type Role,
  type TextStyle,
} from 'react-native';

const WEIGHT_CLASS_TO_KEY: Record<string, string> = {
  'font-light': '300',
  'font-medium': '500',
  'font-semibold': '600',
  'font-bold': '700',
};

function detectWeightFromClassName(className?: string): string | null {
  if (!className) return null;
  for (const cls of className.split(/\s+/)) {
    const w = WEIGHT_CLASS_TO_KEY[cls];
    if (w) return w;
  }
  return null;
}

function resolveFontFamily(
  className: string | undefined,
  style: StyleProp<TextStyle>,
): string {
  const flat = StyleSheet.flatten(style);
  if (flat?.fontFamily) return flat.fontFamily as string;
  const weightFromStyle = flat?.fontWeight;
  const weightFromClass = detectWeightFromClassName(className);
  const key = String(weightFromStyle ?? weightFromClass ?? '400');
  return FONTS_BY_WEIGHT[key] ?? FONTS.regular;
}

const textVariants = cva(
  cn(
    'text-foreground text-base',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn(
          'text-center text-4xl font-bold tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' })
        ),
        h2: cn(
          'border-border border-b pb-2 text-3xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20 first:mt-0' })
        ),
        h3: cn('text-2xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h4: cn('text-xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        p: 'mt-3 leading-7 sm:mt-6',
        blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
        code: cn(
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
        ),
        lead: 'text-muted-foreground text-xl',
        large: 'text-lg font-semibold',
        small: 'text-sm font-medium leading-none',
        muted: 'text-muted-foreground text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  style,
  ...props
}: React.ComponentProps<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  const merged = cn(textVariants({ variant }), textClass, className);
  const fontFamily = resolveFontFamily(merged, style);
  return (
    <Component
      className={merged}
      style={[style, { fontFamily }]}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext };
