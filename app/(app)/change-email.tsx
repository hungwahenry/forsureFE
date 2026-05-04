import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useChangeEmailFlow } from '@/features/account/hooks/useChangeEmailFlow';
import { useMyProfile } from '@/features/users/api/getMyProfile';
import { haptics } from '@/lib/haptics';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sms } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function ChangeEmailScreen() {
  const router = useRouter();
  const profile = useMyProfile();
  const flow = useChangeEmailFlow();

  const onConfirm = async () => {
    const ok = await flow.onConfirm();
    if (ok) router.back();
  };

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          change email
        </Text>
        <View className="size-7" />
      </View>

      {flow.step === 'enter-email' ? (
        <View className="flex-1 px-6 pt-8">
          <View className="bg-primary/10 size-16 items-center justify-center rounded-full">
            <Icon as={Sms} className="text-primary size-8" />
          </View>
          <Text className="text-foreground mt-6 text-2xl font-bold">
            new email address
          </Text>
          <Text className="text-muted-foreground mt-2 text-base leading-6">
            we'll send a code to confirm you control it.
          </Text>
          {profile.data ? (
            <Text className="text-muted-foreground mt-1 text-sm">
              currently {profile.data.email}.
            </Text>
          ) : null}

          <View className="mt-8">
            <Input
              value={flow.newEmail}
              onChangeText={flow.setNewEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoFocus
            />
          </View>

          <View className="mt-auto pb-6">
            <Button
              onPress={() => void flow.onContinue()}
              disabled={!flow.isValidEmail || flow.isRequestingCode}
              size="lg"
            >
              {flow.isRequestingCode ? (
                <LoadingIndicator color="white" />
              ) : (
                <Text>send code</Text>
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
            we sent a 6-digit code to {flow.newEmail}.
          </Text>

          <View className="mt-8">
            <Input
              value={flow.code}
              onChangeText={flow.setCode}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
          </View>

          <View className="mt-3 flex-row">
            <Pressable
              onPress={() => {
                haptics.tap();
                void flow.onResend();
              }}
              hitSlop={8}
            >
              <Text className="text-primary text-sm font-medium">
                resend code
              </Text>
            </Pressable>
          </View>

          <View className="mt-auto pb-6">
            <Button
              onPress={() => void onConfirm()}
              disabled={!flow.canConfirm || flow.isConfirming}
              size="lg"
            >
              {flow.isConfirming ? (
                <LoadingIndicator color="white" />
              ) : (
                <Text>confirm</Text>
              )}
            </Button>
          </View>
        </View>
      )}
    </Screen>
  );
}
