import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { useFinishOnboarding } from '@/features/onboarding/hooks/useFinishOnboarding';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import { ApiError } from '@/lib/api/types';
import {
  checkLocationPermission,
  getCurrentLocation,
  openSystemSettings,
  requestLocationPermission,
  type PermissionStatus,
} from '@/lib/permissions/location';
import { toast } from '@/lib/toast';
import { Location as LocationIcon, Setting2 } from 'iconsax-react-nativejs';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

const TOTAL_STEPS = 6;

export default function LocationStep() {
  const draftLocation = useOnboardingStore((s) => s.draft.location);
  const setField = useOnboardingStore((s) => s.setField);
  const { finishOnboarding, isPending } = useFinishOnboarding();

  const [permission, setPermission] =
    React.useState<PermissionStatus | null>(null);
  const [isFetching, setIsFetching] = React.useState(false);

  React.useEffect(() => {
    void checkLocationPermission().then(setPermission);
  }, []);

  const enableLocation = async () => {
    setIsFetching(true);
    try {
      let status = await checkLocationPermission();
      if (status !== 'granted') {
        status = await requestLocationPermission();
      }
      setPermission(status);
      if (status !== 'granted') return;

      const location = await getCurrentLocation();
      setField('location', location);
    } catch {
      toast.error("couldn't get your location. try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const onFinish = async () => {
    try {
      await finishOnboarding();
      toast.success('welcome to forsure');
      // /onboarding/_layout will now redirect to /home automatically.
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
      <View className="items-center gap-6">
        <View className="bg-primary/10 size-32 items-center justify-center rounded-full">
          <Icon
            as={LocationIcon}
            variant="Bold"
            className="text-primary size-16"
          />
        </View>

        {hasLocation ? (
          <View className="items-center gap-1">
            <Text className="text-foreground text-xl font-semibold">
              {draftLocation?.placeName}
            </Text>
            <Text className="text-muted-foreground text-sm">
              tap finish to wrap up.
            </Text>
          </View>
        ) : isFetching ? (
          <ActivityIndicator />
        ) : permission === 'denied' ? (
          <View className="items-center gap-3">
            <Text className="text-muted-foreground text-center">
              location was denied. open settings to enable it for forsure.
            </Text>
            <Button
              variant="outline"
              onPress={openSystemSettings}
              leftIcon={
                <Icon as={Setting2} className="text-foreground size-5" />
              }
            >
              <Text>open settings</Text>
            </Button>
          </View>
        ) : (
          <Button
            onPress={enableLocation}
            leftIcon={
              <Icon
                as={LocationIcon}
                className="text-primary-foreground size-5"
              />
            }
          >
            <Text>enable location</Text>
          </Button>
        )}
      </View>
    </StepShell>
  );
}
