import { Text } from '@/components/ui/text';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import type { Gender } from '@/features/users/types';
import { haptics } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, View } from 'react-native';

const TOTAL_STEPS = 6;

const OPTIONS: { value: Gender; label: string }[] = [
  { value: 'FEMALE', label: 'female' },
  { value: 'MALE', label: 'male' },
  { value: 'NON_BINARY', label: 'non-binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'prefer not to say' },
];

export default function GenderStep() {
  const draftGender = useOnboardingStore((s) => s.draft.gender);
  const setField = useOnboardingStore((s) => s.setField);
  const [selected, setSelected] = React.useState<Gender | null>(draftGender);

  const onPick = (g: Gender) => {
    haptics.selection();
    setSelected(g);
  };

  const onContinue = () => {
    if (!selected) return;
    setField('gender', selected);
    router.push('/onboarding/location');
  };

  return (
    <StepShell
      step={5}
      totalSteps={TOTAL_STEPS}
      title="how do you identify?"
      subtitle="this helps people who use the 'with X guys/girls' filter on activities."
      onContinue={onContinue}
      continueDisabled={!selected}
    >
      <View className="flex-row flex-wrap gap-3">
        {OPTIONS.map((opt) => {
          const active = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onPick(opt.value)}
              className={cn(
                'h-14 flex-1 basis-[45%] items-center justify-center rounded-full border-2 px-3',
                active
                  ? 'border-primary bg-primary/5'
                  : 'border-foreground/15 bg-muted/40'
              )}
            >
              <Text
                numberOfLines={1}
                className={cn(
                  'text-base',
                  active ? 'text-primary font-semibold' : 'text-foreground'
                )}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </StepShell>
  );
}
