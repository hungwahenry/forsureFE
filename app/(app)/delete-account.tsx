import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useDeleteAccountFlow } from '@/features/account/hooks/useDeleteAccountFlow';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const flow = useDeleteAccountFlow();

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

      {flow.step === 'warn' ? (
        <View className="flex-1 px-6 pt-8">
          <View className="bg-destructive/10 size-16 items-center justify-center rounded-full">
            <Icon as={Trash} className="text-destructive size-8" />
          </View>
          <Text className="text-foreground mt-6 text-2xl font-bold">
            this is permanent
          </Text>
          <Text className="text-muted-foreground mt-2 text-base leading-6">
            your profile, memories, and chats will be deleted. activities
            you're hosting will be cancelled and everyone going will be
            notified.
          </Text>
          <Text className="text-muted-foreground mt-4 text-base leading-6">
            this can't be undone.
          </Text>

          <View className="mt-auto pb-6">
            <Button
              onPress={() => void flow.onContinue()}
              disabled={flow.isRequestingCode}
              variant="destructive"
              size="lg"
            >
              {flow.isRequestingCode ? (
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
              value={flow.code}
              onChangeText={flow.setCode}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
          </View>

          <View className="mt-3 flex-row">
            <Pressable onPress={() => void flow.onResend()} hitSlop={8}>
              <Text className="text-primary text-sm font-medium">
                resend code
              </Text>
            </Pressable>
          </View>

          <View className="mt-auto pb-6">
            <Button
              onPress={() => void flow.onConfirm()}
              disabled={!flow.canConfirm || flow.isDeleting}
              variant="destructive"
              size="lg"
            >
              {flow.isDeleting ? (
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
