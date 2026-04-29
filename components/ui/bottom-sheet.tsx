import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import * as React from 'react';

interface BottomSheetProps
  extends Omit<BottomSheetModalProps, 'backgroundStyle' | 'handleIndicatorStyle'> {
  /** Tailwind classes applied to the inner content view. */
  contentClassName?: string;
}

/**
 * Brand-themed wrapper around `@gorhom/bottom-sheet`'s `BottomSheetModal`.
 * Forwards a ref so callers can imperatively `.present()` / `.dismiss()`.
 *
 * @example
 *   const ref = useRef<BottomSheetModal>(null);
 *   ref.current?.present();
 *
 *   <BottomSheet ref={ref} snapPoints={['65%']}>
 *     <Text>...</Text>
 *   </BottomSheet>
 */
export const BottomSheet = React.forwardRef<
  BottomSheetModal,
  BottomSheetProps
>(function BottomSheet(
  { children, contentClassName, ...rest },
  ref,
) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <BottomSheetModal
      ref={ref}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      {...rest}
    >
      {(typeof children === 'function'
        ? children
        : children) /* gorhom accepts both render-prop and node */}
    </BottomSheetModal>
  );
});

function renderBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
      opacity={0.45}
    />
  );
}

// Re-export for convenience (callers don't need a separate import for the type).
export type { BottomSheetModal } from '@gorhom/bottom-sheet';
