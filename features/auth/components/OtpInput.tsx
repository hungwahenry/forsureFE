import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired when the user has typed `length` digits. */
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  length?: number;
  autoFocus?: boolean;
}

/**
 * 6-box OTP input. Renders visual boxes that mirror the value of a single
 * hidden TextInput — that lets paste, autofill, and selection "just work"
 * without juggling refs across N inputs.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  error,
  disabled,
  length = 6,
  autoFocus = true,
}: OtpInputProps) {
  const inputRef = React.useRef<TextInput>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleChange = (text: string) => {
    const sanitized = text.replace(/\D/g, '').slice(0, length);
    onChange(sanitized);
    if (sanitized.length === length) {
      onComplete?.(sanitized);
    }
  };

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      className="items-center"
      disabled={disabled}
      accessibilityRole="text"
      accessibilityLabel="One-time code"
    >
      <View className="flex-row gap-2">
        {Array.from({ length }).map((_, i) => {
          const digit = value[i] ?? '';
          const isActive =
            isFocused && i === Math.min(value.length, length - 1);
          const isFilled = digit !== '';

          return (
            <View
              key={i}
              className={cn(
                'bg-background h-14 w-12 items-center justify-center rounded-xl border-2',
                error
                  ? 'border-destructive'
                  : isActive
                    ? 'border-primary'
                    : isFilled
                      ? 'border-foreground/30'
                      : 'border-border',
                disabled && 'opacity-50'
              )}
            >
              <Text className="text-foreground text-2xl font-semibold">
                {digit}
              </Text>
            </View>
          );
        })}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : undefined}
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        maxLength={length}
        autoFocus={autoFocus}
        editable={!disabled}
        caretHidden
        // Off-screen but focusable; keyboard pops reliably across platforms.
        style={{
          position: 'absolute',
          opacity: 0,
          height: 1,
          width: 1,
        }}
      />
    </Pressable>
  );
}
