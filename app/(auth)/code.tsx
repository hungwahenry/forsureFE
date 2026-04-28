import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRequestCode } from '@/features/auth/api/requestCode';
import { useVerifyCode } from '@/features/auth/api/verifyCode';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { useResendCooldown } from '@/features/auth/hooks/useResendCooldown';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CodeScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = React.useState('');
  const [hasError, setHasError] = React.useState(false);

  const verifyCode = useVerifyCode();
  const requestCode = useRequestCode();
  const cooldown = useResendCooldown(60);
  const signIn = useAuthStore((s) => s.signIn);

  // Start the cooldown on mount — the previous screen just sent a code.
  React.useEffect(() => {
    cooldown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onVerify = async (codeValue: string) => {
    if (!email) return;
    setHasError(false);
    try {
      const result = await verifyCode.mutateAsync({
        email,
        code: codeValue,
      });
      await signIn({
        user: result.user,
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
      // (auth)/_layout will redirect on the next render based on the new
      // store state — onboarding-required → /onboarding, else → /home.
    } catch (err) {
      setHasError(true);
      setCode('');
      const message =
        err instanceof ApiError
          ? err.message
          : 'wrong code. try again.';
      toast.error(message);
    }
  };

  const onResend = async () => {
    if (!email || !cooldown.canResend || requestCode.isPending) return;
    try {
      await requestCode.mutateAsync({ email });
      cooldown.start();
      setCode('');
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
    <SafeAreaView className="bg-background flex-1" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
            value={code}
            onChange={(v) => {
              setCode(v);
              if (hasError) setHasError(false);
            }}
            onComplete={onVerify}
            error={hasError}
            disabled={verifyCode.isPending}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
