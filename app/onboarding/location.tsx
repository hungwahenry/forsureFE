import { LocationPrompt } from '@/features/onboarding/components/LocationPrompt';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { useFinishOnboarding } from '@/features/onboarding/hooks/useFinishOnboarding';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';

const TOTAL_STEPS = 6;

export default function LocationStep() {
  const draftLocation = useOnboardingStore((s) => s.draft.location);
  const setField = useOnboardingStore((s) => s.setField);
  const { finishOnboarding, isPending } = useFinishOnboarding();

  const onFinish = async () => {
    try {
      await finishOnboarding();
      toast.success('welcome to forsure');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'something went wrong. try again.';
      toast.error(message);
    }
  };

  const hasLocation = !!draftLocation;

  return (
    <StepShell
      step={6}
      totalSteps={TOTAL_STEPS}
      title="where are you?"
      subtitle="forsure shows activities near you. we use your precise location for matching only."
      onContinue={hasLocation ? onFinish : undefined}
      continueDisabled={!hasLocation}
      continueLoading={isPending}
      continueLabel="finish"
    >
      <LocationPrompt
        value={draftLocation ?? null}
        onChange={(loc) => setField('location', loc)}
      />
    </StepShell>
  );
}
