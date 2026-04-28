import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type {
  Icon as IconsaxIcon,
  IconProps as IconsaxIconProps,
} from 'iconsax-react-nativejs';
import { cssInterop } from 'nativewind';
import * as React from 'react';

type IconProps = IconsaxIconProps & {
  /** The Iconsax icon component to render, e.g. `as={Heart}`. */
  as: IconsaxIcon;
};

function IconImpl({ as: Component, ...props }: IconProps) {
  return <Component {...props} />;
}

// Map className styles → component props.
//   - `size-4`, `size-5` etc. set width/height in CSS, which we forward to
//     iconsax's `size` prop (it draws square icons via that single number).
//   - text colors (`text-primary`, `text-foreground`, ...) resolve to a
//     `color` style which we forward to iconsax's `color` prop.
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

/**
 * Wrapper for Iconsax icons with NativeWind className support and inheritance
 * of the surrounding text color (so icons inside Buttons/Texts pick up the
 * right tone automatically).
 *
 * @example
 *   import { Heart } from 'iconsax-react-nativejs';
 *   <Icon as={Heart} className="size-5 text-primary" />
 *
 *   // Pick a different visual weight per call site:
 *   <Icon as={Heart} variant="Bold" />
 *   <Icon as={Heart} variant="TwoTone" />
 *
 * Supported `variant` values: 'Linear' (default, outlined) | 'Outline' |
 * 'Broken' | 'Bold' | 'Bulk' | 'TwoTone'.
 */
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
