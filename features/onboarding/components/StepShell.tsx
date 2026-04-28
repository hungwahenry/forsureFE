import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'iconsax-react-nativejs';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StepShellProps {
  /** 1-based current step index. */
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  /** Defaults to "continue" — override on the last step ("finish"). */
  continueLabel?: string;
  /** Override back behaviour (default is router.back()). */
  onBack?: () => void;
  /** Hide the back button on the first step if needed. */
  hideBack?: boolean;
  children: React.ReactNode;
}

export function StepShell({
  step,
  totalSteps,
  title,
  subtitle,
  onContinue,
  continueDisabled,
  continueLoading,
  continueLabel = 'continue',
  onBack,
  hideBack,
  children,
}: StepShellProps) {
  const handleBack = onBack ?? (() => router.back());

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 p-6">
          {/* Header: back button + progress segments */}
          <View className="mb-8 flex-row items-center gap-4">
            {hideBack ? (
              <View className="size-6" />
            ) : (
              <Pressable
                onPress={handleBack}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Icon as={ArrowLeft} className="text-foreground size-6" />
              </Pressable>
            )}
            <View className="flex-1 flex-row gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <View
                  key={i}
                  className={cn(
                    'h-1.5 flex-1 rounded-full',
                    i < step ? 'bg-primary' : 'bg-muted'
                  )}
                />
              ))}
            </View>
          </View>

          {/* Title + subtitle */}
          <View className="mb-8 gap-2">
            <Text className="text-foreground text-3xl font-bold">{title}</Text>
            {subtitle ? (
              <Text className="text-muted-foreground">{subtitle}</Text>
            ) : null}
          </View>

          {/* Step body */}
          <View className="flex-1">{children}</View>

          {/* Continue */}
          {onContinue ? (
            <Button
              size="lg"
              onPress={onContinue}
              disabled={continueDisabled || continueLoading}
              rightIcon={
                continueLoading ? undefined : (
                  <Icon
                    as={ArrowRight}
                    className="text-primary-foreground size-5"
                  />
                )
              }
            >
              <Text>{continueLoading ? '...' : continueLabel}</Text>
            </Button>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
