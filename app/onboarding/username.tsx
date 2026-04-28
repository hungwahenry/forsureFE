import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCheckUsername } from '@/features/onboarding/api/checkUsername';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { useDebouncedValue } from '@/features/onboarding/hooks/useDebouncedValue';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import {
  USERNAME_PATTERN,
  usernameSchema,
} from '@/features/onboarding/validation/schemas';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';
import { CloseCircle, TickCircle, User } from 'iconsax-react-nativejs';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

const TOTAL_STEPS = 6;

export default function UsernameStep() {
  const draftUsername = useOnboardingStore((s) => s.draft.username);
  const setField = useOnboardingStore((s) => s.setField);

  const [value, setValue] = React.useState(draftUsername);
  const debounced = useDebouncedValue(value.trim().toLowerCase(), 400);

  const formatValid = USERNAME_PATTERN.test(debounced);
  const availabilityQuery = useCheckUsername(
    debounced,
    formatValid && debounced.length >= 3
  );

  const onContinue = () => {
    const parsed = usernameSchema.safeParse(value);
    if (!parsed.success) return;
    setField('username', parsed.data);
    router.push('/onboarding/display-name');
  };

  const isAvailable = availabilityQuery.data === true;
  const isTaken = availabilityQuery.data === false;
  const canContinue = formatValid && isAvailable;

  return (
    <StepShell
      step={1}
      totalSteps={TOTAL_STEPS}
      title="pick a username"
      subtitle="this is how others will find you. lowercase, 3–20 chars."
      onContinue={onContinue}
      continueDisabled={!canContinue}
    >
      <View className="gap-2">
        <Input
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          placeholder="henry"
          value={value}
          onChangeText={(t) => setValue(t.toLowerCase())}
          maxLength={20}
          returnKeyType="next"
          onSubmitEditing={canContinue ? onContinue : undefined}
          leftIcon={
            <Icon as={User} className="text-muted-foreground size-5" />
          }
          rightIcon={
            <UsernameStatus
              hasInput={debounced.length > 0}
              formatValid={formatValid}
              loading={availabilityQuery.isFetching}
              available={isAvailable}
              taken={isTaken}
            />
          }
        />
        <UsernameHint
          value={debounced}
          formatValid={formatValid}
          taken={isTaken}
        />
      </View>
    </StepShell>
  );
}

function UsernameStatus({
  hasInput,
  formatValid,
  loading,
  available,
  taken,
}: {
  hasInput: boolean;
  formatValid: boolean;
  loading: boolean;
  available: boolean;
  taken: boolean;
}) {
  if (!hasInput) return null;
  if (loading) return <ActivityIndicator size="small" />;
  if (!formatValid) return null;
  if (available)
    return <Icon as={TickCircle} variant="Bold" className="text-primary size-5" />;
  if (taken)
    return (
      <Icon as={CloseCircle} variant="Bold" className="text-destructive size-5" />
    );
  return null;
}

function UsernameHint({
  value,
  formatValid,
  taken,
}: {
  value: string;
  formatValid: boolean;
  taken: boolean;
}) {
  if (value.length === 0) return null;
  if (!formatValid) {
    return (
      <Text className="text-muted-foreground text-sm">
        lowercase letters, digits, or underscores. start with a letter.
      </Text>
    );
  }
  if (taken) {
    return (
      <Text className="text-destructive text-sm">that one's taken.</Text>
    );
  }
  return <Text className={cn('text-primary text-sm')}>nice, it's yours.</Text>;
}
