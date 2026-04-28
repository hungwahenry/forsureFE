import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { OtpInput as RnOtpInput } from 'react-native-otp-entry';

export interface OtpInputRef {
  clear: () => void;
  focus: () => void;
}

interface OtpInputProps {
  onChange?: (value: string) => void;
  /** Fired when the user has filled all `length` digits. */
  onComplete: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  length?: number;
  autoFocus?: boolean;
  ref?: React.Ref<OtpInputRef>;
}

const BOX_HEIGHT = 56;
const BOX_WIDTH = 48;

/**
 * Brand-themed wrapper around `react-native-otp-entry`. Uncontrolled
 * internally — parents observe via `onChange` / `onComplete` and clear
 * via the forwarded ref.
 */
export function OtpInput({
  onChange,
  onComplete,
  error,
  disabled,
  length = 6,
  autoFocus = true,
  ref,
}: OtpInputProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const innerRef = React.useRef<React.ComponentRef<typeof RnOtpInput>>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      clear: () => innerRef.current?.clear(),
      focus: () => innerRef.current?.focus(),
    }),
    []
  );

  const baseBox = {
    height: BOX_HEIGHT,
    width: BOX_WIDTH,
    borderRadius: 12,
    borderWidth: 2,
  };

  return (
    <RnOtpInput
      ref={innerRef}
      numberOfDigits={length}
      autoFocus={autoFocus}
      disabled={disabled}
      hideStick
      blurOnFilled
      onTextChange={onChange}
      onFilled={onComplete}
      theme={{
        containerStyle: { gap: 8, justifyContent: 'center' },
        pinCodeContainerStyle: {
          ...baseBox,
          backgroundColor: error ? withAlpha(colors.destructive, 0.05) : colors.muted,
          borderColor: error ? colors.destructive : withAlpha(colors.foreground, 0.2),
        },
        focusedPinCodeContainerStyle: {
          ...baseBox,
          backgroundColor: error
            ? withAlpha(colors.destructive, 0.05)
            : withAlpha(colors.primary, 0.05),
          borderColor: error ? colors.destructive : colors.primary,
        },
        filledPinCodeContainerStyle: {
          ...baseBox,
          backgroundColor: colors.background,
          borderColor: error ? colors.destructive : withAlpha(colors.foreground, 0.4),
        },
        disabledPinCodeContainerStyle: { opacity: 0.5 },
        pinCodeTextStyle: {
          color: colors.foreground,
          fontSize: 24,
          fontWeight: '600',
        },
      }}
    />
  );
}

/** Apply alpha to an `hsl(...)` string used by our theme. */
function withAlpha(hsl: string, alpha: number): string {
  const inner = hsl.match(/hsl\(([^)]+)\)/)?.[1];
  return inner ? `hsla(${inner} / ${alpha})` : hsl;
}
