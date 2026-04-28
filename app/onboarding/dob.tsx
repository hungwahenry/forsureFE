import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import {
  dateOfBirthSchema,
  MIN_AGE_YEARS,
} from '@/features/onboarding/validation/schemas';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Calendar } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

const TOTAL_STEPS = 6;
const DEFAULT_DOB = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 25);
  return d;
})();
const MAX_DATE = (() => {
  // Latest allowed birth date: today minus MIN_AGE_YEARS — anything later is < 18.
  const d = new Date();
  d.setFullYear(d.getFullYear() - MIN_AGE_YEARS);
  return d;
})();
const MIN_DATE = new Date('1920-01-01');

export default function DobStep() {
  const draftDob = useOnboardingStore((s) => s.draft.dateOfBirth);
  const setField = useOnboardingStore((s) => s.setField);

  const [date, setDate] = React.useState<Date | null>(draftDob);
  const [pickerVisible, setPickerVisible] = React.useState(
    Platform.OS === 'ios' // iOS shows inline by default
  );

  const parsed = date ? dateOfBirthSchema.safeParse(date) : null;
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
      subtitle={`forsure is for ${MIN_AGE_YEARS}+. we don't show your full date to anyone else.`}
      onContinue={onContinue}
      continueDisabled={!canContinue}
    >
      <View className="gap-4">
        <Pressable
          onPress={() => setPickerVisible(true)}
          className="border-foreground/15 bg-muted/40 h-14 flex-row items-center gap-3 rounded-full border-2 px-4"
        >
          <Icon as={Calendar} className="text-muted-foreground size-5" />
          <Text
            className={
              date ? 'text-foreground text-base' : 'text-muted-foreground text-base'
            }
          >
            {date ? formatDate(date) : 'tap to choose'}
          </Text>
        </Pressable>

        {tooYoung ? (
          <Text className="text-destructive text-sm">
            you must be {MIN_AGE_YEARS} or older to use forsure.
          </Text>
        ) : null}

        {pickerVisible ? (
          <View className="bg-muted/30 items-center rounded-2xl py-2">
            <DateTimePicker
              value={date ?? DEFAULT_DOB}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={MAX_DATE}
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
