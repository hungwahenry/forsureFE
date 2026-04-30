import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { Icon as IconsaxIcon } from 'iconsax-react-nativejs';
import * as React from 'react';
import { View } from 'react-native';

interface EmptyStateProps {
  /** Iconsax icon rendered in a circular badge above the title. */
  icon?: IconsaxIcon;
  /** Custom illustration/image in place of `icon` (e.g. an SVG or `<Image>`). */
  image?: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Action element(s) — typically `<Button>`s. Stacked vertically with spacing. */
  actions?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  image,
  title,
  subtitle,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('items-center px-6 pt-12', className)}>
      {image ? (
        <View className="mb-4">{image}</View>
      ) : icon ? (
        <View className="bg-muted/60 mb-4 size-14 items-center justify-center rounded-full">
          <Icon as={icon} className="text-muted-foreground size-6" />
        </View>
      ) : null}

      <Text className="text-foreground mb-1 text-base font-semibold">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-muted-foreground text-center text-sm">
          {subtitle}
        </Text>
      ) : null}

      {actions ? (
        <View className="mt-6 w-full gap-3">{actions}</View>
      ) : null}
    </View>
  );
}
