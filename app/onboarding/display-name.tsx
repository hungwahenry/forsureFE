import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import { displayNameSchema } from '@/features/onboarding/validation/schemas';
import { router } from 'expo-router';
import { Profile } from 'iconsax-react-nativejs';
import * as React from 'react';
import { View } from 'react-native';

const TOTAL_STEPS = 6;

export default function DisplayNameStep() {
  const draftDisplayName = useOnboardingStore((s) => s.draft.displayName);
  const setField = useOnboardingStore((s) => s.setField);

  const [value, setValue] = React.useState(draftDisplayName);
  const parsed = displayNameSchema.safeParse(value);
  const canContinue = parsed.success;

  const onContinue = () => {
    if (!parsed.success) return;
    setField('displayName', parsed.data);
    router.push('/onboarding/dob');
  };

  return (
    <StepShell
      step={2}
      totalSteps={TOTAL_STEPS}
      title="what should we call you?"
      subtitle="this is the name others see on your activities."
      onContinue={onContinue}
      continueDisabled={!canContinue}
    >
      <View className="gap-2">
        <Input
          autoFocus
          autoCapitalize="words"
          placeholder="Henry"
          value={value}
          onChangeText={setValue}
          maxLength={50}
          returnKeyType="next"
          onSubmitEditing={canContinue ? onContinue : undefined}
          leftIcon={
            <Icon as={Profile} className="text-muted-foreground size-5" />
          }
        />
        {!parsed.success && value.length > 0 ? (
          <Text className="text-muted-foreground text-sm">
            {parsed.error.issues[0]?.message}
          </Text>
        ) : null}
      </View>
    </StepShell>
  );
}
