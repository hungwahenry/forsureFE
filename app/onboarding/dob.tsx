import { FieldButton } from '@/components/ui/field-button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { cn } from '@/lib/utils';
import { useConfigNumber } from '@/features/config/hooks/useConfigNumber';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import {
  DEFAULT_MIN_AGE_YEARS,
  makeDateOfBirthSchema,
} from '@/features/onboarding/validation/schemas';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Calendar } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Platform, View } from 'react-native';

const TOTAL_STEPS = 6;
const DEFAULT_DOB = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 25);
  return d;
})();
const MIN_DATE = new Date('1920-01-01');

export default function DobStep() {
  const draftDob = useOnboardingStore((s) => s.draft.dateOfBirth);
  const setField = useOnboardingStore((s) => s.setField);

  const minAgeYears = useConfigNumber(
    'onboarding.min_age_years',
    DEFAULT_MIN_AGE_YEARS,
  );

  const [date, setDate] = React.useState<Date | null>(draftDob);
  const [pickerVisible, setPickerVisible] = React.useState(
    Platform.OS === 'ios' // iOS shows inline by default
  );

  // Latest allowed birth date: today minus minAgeYears — anything later is too young.
  const maxDate = React.useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - minAgeYears);
    return d;
  }, [minAgeYears]);

  const dobSchema = React.useMemo(
    () => makeDateOfBirthSchema(minAgeYears),
    [minAgeYears],
  );
  const parsed = date ? dobSchema.safeParse(date) : null;
  const canContinue = parsed?.success ?? false;
  const tooYoung = !!date && (parsed && !parsed.success);

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setPickerVisible(false);
      if (event.type === 'dismissed') return;
    }
    if (selected) setDate(selected);
  };

  const onContinue = () => {
    if (!parsed?.success) return;
    setField('dateOfBirth', parsed.data);
    router.push('/onboarding/avatar');
  };

  return (
    <StepShell
      step={3}
      totalSteps={TOTAL_STEPS}
      title="when's your birthday?"
      subtitle={`forsure is for ${minAgeYears}+. we don't show your full date to anyone else.`}
      onContinue={onContinue}
      continueDisabled={!canContinue}
    >
      <View className="gap-4">
        <FieldButton
          onPress={() => setPickerVisible(true)}
          leftIcon={
            <Icon as={Calendar} className="text-muted-foreground size-5" />
          }
        >
          <Text
            className={cn(
              'text-base',
              date ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {date ? formatDate(date) : 'tap to choose'}
          </Text>
        </FieldButton>

        {tooYoung ? (
          <Text className="text-destructive text-sm">
            you must be {minAgeYears} or older to use forsure.
          </Text>
        ) : null}

        {pickerVisible ? (
          <View className="bg-muted/30 items-center rounded-2xl py-2">
            <DateTimePicker
              value={date ?? DEFAULT_DOB}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={maxDate}
              minimumDate={MIN_DATE}
              onChange={onChange}
            />
          </View>
        ) : null}
      </View>
    </StepShell>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
