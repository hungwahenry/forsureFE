import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useRequestCode } from '@/features/auth/api/requestCode';
import {
  OtpInput,
  type OtpInputRef,
} from '@/features/auth/components/OtpInput';
import { useResendCooldown } from '@/features/auth/hooks/useResendCooldown';
import { useSignInFromCode } from '@/features/auth/hooks/useSignInFromCode';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export default function CodeScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const otpRef = React.useRef<OtpInputRef>(null);
  const [hasError, setHasError] = React.useState(false);

  const { signInFromCode, isPending: isVerifying } = useSignInFromCode();
  const requestCode = useRequestCode();
  const cooldown = useResendCooldown(60);

  // Start the cooldown on mount — the previous screen just sent a code.
  React.useEffect(() => {
    cooldown.start();
  }, []);

  const onVerify = async (codeValue: string) => {
    if (!email) return;
    setHasError(false);
    try {
      await signInFromCode({ email, code: codeValue });
      // Route guards handle redirect on next render.
    } catch (err) {
      setHasError(true);
      otpRef.current?.clear();
      const message =
        err instanceof ApiError ? err.message : 'wrong code. try again.';
      toast.error(message);
    }
  };

  const onResend = async () => {
    if (!email || !cooldown.canResend || requestCode.isPending) return;
    try {
      await requestCode.mutateAsync({ email });
      cooldown.start();
      otpRef.current?.clear();
      setHasError(false);
      toast.success('new code sent');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "couldn't resend. try again.";
      toast.error(message);
    }
  };

  return (
    <Screen>
      <View className="flex-1 p-6">
          <Pressable onPress={() => router.back()} className="mb-8">
            <Icon as={ArrowLeft} className="text-foreground size-6" />
          </Pressable>

          <View className="mb-12 gap-2">
            <Text className="text-foreground text-3xl font-bold">
              enter the code
            </Text>
            <Text className="text-muted-foreground">
              we sent a 6-digit code to {email ?? 'your email'}.
            </Text>
          </View>

          <OtpInput
            ref={otpRef}
            onChange={() => {
              if (hasError) setHasError(false);
            }}
            onComplete={onVerify}
            error={hasError}
            disabled={isVerifying}
          />

          <View className="flex-1" />

          <Pressable
            onPress={onResend}
            disabled={!cooldown.canResend || requestCode.isPending}
            className="mb-4 self-center"
          >
            <Text
              className={cn(
                'text-center',
                cooldown.canResend
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {cooldown.canResend
                ? requestCode.isPending
                  ? 'resending...'
                  : 'resend code'
                : `resend in ${cooldown.secondsLeft}s`}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.back()} className="self-center">
            <Text className="text-muted-foreground">wrong email?</Text>
          </Pressable>
      </View>
    </Screen>
  );
}
