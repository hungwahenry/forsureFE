import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

interface StepShellProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  continueLabel?: string;
  onBack?: () => void;
  backIcon?: React.ComponentProps<typeof Icon>['as'];
  backLabel?: string;
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
  backIcon = ArrowLeft,
  backLabel = 'Go back',
  hideBack,
  children,
}: StepShellProps) {
  const handleBack = onBack ?? (() => router.back());

  return (
    <Screen>
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
                accessibilityLabel={backLabel}
              >
                <Icon as={backIcon} className="text-foreground size-6" />
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

          {/* Spacer — pushes title/body/CTA to the bottom of the screen.
              Collapses when the keyboard is up so content stays visible. */}
          <View className="flex-1" />

          {/* Title + subtitle */}
          <View className="mb-8 gap-2">
            <Text className="text-foreground text-3xl font-bold">{title}</Text>
            {subtitle ? (
              <Text className="text-muted-foreground">{subtitle}</Text>
            ) : null}
          </View>

          {/* Step body */}
          <View className="mb-12">{children}</View>

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
    </Screen>
  );
}
