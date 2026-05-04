import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useDeleteAccount } from '@/features/account/api/deleteAccount';
import { useStartStepUp } from '@/features/step-up/api/startStepUp';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type Step = 'warn' | 'otp';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>('warn');
  const [challengeId, setChallengeId] = React.useState<string | null>(null);
  const [code, setCode] = React.useState('');

  const startStepUp = useStartStepUp();
  const deleteAccount = useDeleteAccount();
  const { signOut } = useSignOut();

  const onContinue = async () => {
    try {
      const res = await startStepUp.mutateAsync('DELETE_ACCOUNT');
      setChallengeId(res.challengeId);
      setStep('otp');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't send code. try again.";
      toast.error(message);
    }
  };

  const onResend = async () => {
    try {
      const res = await startStepUp.mutateAsync('DELETE_ACCOUNT');
      setChallengeId(res.challengeId);
      toast('code resent.');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't resend.";
      toast.error(message);
    }
  };

  const onConfirm = async () => {
    if (!challengeId || code.length !== 6) return;
    try {
      await deleteAccount.mutateAsync({ challengeId, code });
      // The user record is gone; sign out clears local state and the auth gate
      // bounces us to /welcome. Server logout call will 401 harmlessly.
      await signOut();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't delete. try again.";
      toast.error(message);
    }
  };

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          delete account
        </Text>
        <View className="size-7" />
      </View>

      {step === 'warn' ? (
        <View className="flex-1 px-6 pt-8">
          <View className="bg-destructive/10 size-16 items-center justify-center rounded-full">
            <Icon as={Trash} className="text-destructive size-8" />
          </View>
          <Text className="text-foreground mt-6 text-2xl font-bold">
            this is permanent
          </Text>
          <Text className="text-muted-foreground mt-2 text-base leading-6">
            your profile, memories, and chats will be deleted. activities you're
            hosting will be cancelled and everyone going will be notified.
          </Text>
          <Text className="text-muted-foreground mt-4 text-base leading-6">
            this can't be undone.
          </Text>

          <View className="mt-auto pb-6">
            <Button
              onPress={() => void onContinue()}
              disabled={startStepUp.isPending}
              variant="destructive"
              size="lg"
            >
              {startStepUp.isPending ? (
                <LoadingIndicator color="white" />
              ) : (
                <Text>continue</Text>
              )}
            </Button>
          </View>
        </View>
      ) : (
        <View className="flex-1 px-6 pt-8">
          <Text className="text-foreground text-2xl font-bold">
            enter the code
          </Text>
          <Text className="text-muted-foreground mt-2 text-base leading-6">
            we sent a 6-digit code to your email. enter it to confirm deleting
            your account.
          </Text>

          <View className="mt-8">
            <Input
              value={code}
              onChangeText={(v) => setCode(v.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
          </View>

          <View className="mt-3 flex-row">
            <Pressable onPress={() => void onResend()} hitSlop={8}>
              <Text className="text-primary text-sm font-medium">
                resend code
              </Text>
            </Pressable>
          </View>

          <View className="mt-auto pb-6">
            <Button
              onPress={() => void onConfirm()}
              disabled={code.length !== 6 || deleteAccount.isPending}
              variant="destructive"
              size="lg"
            >
              {deleteAccount.isPending ? (
                <LoadingIndicator color="white" />
              ) : (
                <Text>delete my account</Text>
              )}
            </Button>
          </View>
        </View>
      )}
    </Screen>
  );
}
