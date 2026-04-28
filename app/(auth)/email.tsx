import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { useRequestCode } from '@/features/auth/api/requestCode';
import { emailSchema } from '@/features/auth/validation/schemas';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Sms } from 'iconsax-react-nativejs';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const formSchema = z.object({ email: emailSchema });
type FormValues = z.infer<typeof formSchema>;

export default function EmailScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const requestCode = useRequestCode();

  const onSubmit = async ({ email }: FormValues) => {
    try {
      await requestCode.mutateAsync({ email });
      router.push({ pathname: '/code', params: { email } });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'something went wrong. try again.';
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

          <View className="mb-8 gap-2">
            <Text className="text-foreground text-3xl font-bold">
              what's your email?
            </Text>
            <Text className="text-muted-foreground">
              we'll send you a 6-digit code.
            </Text>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                placeholder="you@forsure.fyi"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoFocus
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={handleSubmit(onSubmit)}
                editable={!requestCode.isPending}
                leftIcon={
                  <Icon
                    as={Sms}
                    className="text-muted-foreground size-5"
                  />
                }
              />
            )}
          />
          {errors.email ? (
            <Text className="text-destructive mt-2 text-sm">
              {errors.email.message}
            </Text>
          ) : null}

          <View className="flex-1" />

          <Button
            size="lg"
            onPress={handleSubmit(onSubmit)}
            disabled={requestCode.isPending}
            rightIcon={
              requestCode.isPending ? undefined : (
                <Icon
                  as={ArrowRight}
                  className="text-primary-foreground size-5"
                />
              )
            }
          >
            {requestCode.isPending ? (
              <LoadingIndicator color="white" />
            ) : (
              <Text>send code</Text>
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
