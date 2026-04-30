import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type {
  Icon as IconsaxIcon,
  IconProps as IconsaxIconProps,
} from 'iconsax-react-nativejs';
import { cssInterop } from 'nativewind';
import * as React from 'react';

type IconProps = IconsaxIconProps & {
  /** The iconsax icon component to render, e.g. `as={Heart}`. */
  as: IconsaxIcon;
};

function IconImpl({ as: Component, ...props }: IconProps) {
  return <Component {...props} />;
}

// Forward `size-*` and `text-*` classes to iconsax's `size` and `color` props.
cssInterop(IconImpl, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
      color: 'color',
    },
  },
});

// Inherits surrounding text color so icons inside Buttons/Texts pick up the right tone.
function Icon({
  as,
  className,
  size = 16,
  variant = 'Linear',
  ...props
}: IconProps) {
  const textClass = React.useContext(TextClassContext);
  return (
    <IconImpl
      as={as}
      className={cn('text-foreground', textClass, className)}
      size={size}
      variant={variant}
      {...props}
    />
  );
}

export { Icon };
export type { IconProps };
