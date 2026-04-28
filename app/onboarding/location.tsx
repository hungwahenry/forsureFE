import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useCompleteOnboarding } from '@/features/onboarding/api/completeOnboarding';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import type { CompleteOnboardingPayload } from '@/features/onboarding/types';
import { ApiError } from '@/lib/api/types';
import { getTokens, setTokens } from '@/lib/auth/tokenStorage';
import {
  checkLocationPermission,
  getCurrentLocation,
  openSystemSettings,
  requestLocationPermission,
  type PermissionStatus,
} from '@/lib/permissions/location';
import { toast } from '@/lib/toast';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Location as LocationIcon, Setting2 } from 'iconsax-react-nativejs';

const TOTAL_STEPS = 6;

export default function LocationStep() {
  const draft = useOnboardingStore((s) => s.draft);
  const setField = useOnboardingStore((s) => s.setField);
  const resetDraft = useOnboardingStore((s) => s.reset);
  const setUser = useAuthStore((s) => s.setUser);

  const [permission, setPermission] =
    React.useState<PermissionStatus | null>(null);
  const [isFetching, setIsFetching] = React.useState(false);

  const completeOnboarding = useCompleteOnboarding();

  // Read the existing permission state on mount.
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
    if (
      !draft.dateOfBirth ||
      !draft.gender ||
      !draft.avatarKey ||
      !draft.location
    ) {
      toast.error('something is missing — please go back through the steps.');
      return;
    }

    const payload: CompleteOnboardingPayload = {
      username: draft.username,
      displayName: draft.displayName,
      dateOfBirth: draft.dateOfBirth.toISOString(),
      gender: draft.gender,
      avatarKey: draft.avatarKey,
      location: draft.location,
    };

    try {
      const result = await completeOnboarding.mutateAsync(payload);

      // Replace the access token (new one carries `onboarded: true`); refresh
      // token is unchanged.
      const existing = await getTokens();
      if (existing?.refreshToken) {
        await setTokens({
          accessToken: result.accessToken,
          refreshToken: existing.refreshToken,
        });
      }

      // setUser recomputes onboardingRequired → false, which causes the
      // /onboarding _layout guard to redirect to /home on next render.
      setUser(result.user);
      resetDraft();
      toast.success('welcome to forsure');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'something went wrong. try again.';
      toast.error(message);
    }
  };

  const hasLocation = !!draft.location;

  return (
    <StepShell
      step={6}
      totalSteps={TOTAL_STEPS}
      title="where are you?"
      subtitle="forsure shows activities near you. we use your precise location for matching only."
      onContinue={hasLocation ? onFinish : undefined}
      continueDisabled={!hasLocation}
      continueLoading={completeOnboarding.isPending}
      continueLabel="finish"
    >
      <View className="items-center gap-6">
        <View className="bg-primary/10 size-32 items-center justify-center rounded-full">
          <Icon as={LocationIcon} variant="Bold" className="text-primary size-16" />
        </View>

        {hasLocation ? (
          <View className="items-center gap-1">
            <Text className="text-foreground text-xl font-semibold">
              {draft.location?.placeName}
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
              <Icon as={LocationIcon} className="text-primary-foreground size-5" />
            }
          >
            <Text>enable location</Text>
          </Button>
        )}
      </View>
    </StepShell>
  );
}
