import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import type { LocationCoords } from '@/features/onboarding/types';
import { useDeviceLocation } from '@/lib/hooks/useDeviceLocation';
import { openSystemSettings } from '@/lib/permissions/location';
import { toast } from '@/lib/toast';
import { Location as LocationIcon, Setting2 } from 'iconsax-react-nativejs';
import * as React from 'react';
import { View } from 'react-native';

interface LocationPromptProps {
  value: LocationCoords | null;
  onChange: (location: LocationCoords) => void;
}

export function LocationPrompt({ value, onChange }: LocationPromptProps) {
  const { permission, isFetching, fetch } = useDeviceLocation();

  const enableLocation = async () => {
    const loc = await fetch();
    if (!loc) {
      if (permission === 'granted') toast.error("couldn't get your location. try again.");
      return;
    }
    if (!loc.placeName) {
      toast.error("couldn't determine your area. try again in a moment.");
      return;
    }
    onChange({ lat: loc.lat, lng: loc.lng, placeName: loc.placeName });
  };

  return (
    <View className="items-center gap-6">
      <View className="bg-primary/10 size-32 items-center justify-center rounded-full">
        <Icon
          as={LocationIcon}
          variant="Bold"
          className="text-primary size-16"
        />
      </View>

      {value ? (
        <View className="items-center gap-1">
          <Text className="text-foreground text-xl font-semibold">
            {value.placeName}
          </Text>
          <Text className="text-muted-foreground text-sm">
            tap finish to wrap up.
          </Text>
        </View>
      ) : isFetching ? (
        <LoadingIndicator size={10} />
      ) : permission === 'denied' ? (
        <View className="w-full items-center gap-3">
          <Text className="text-muted-foreground text-center">
            location was denied. enable it in settings, then come back.
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
          <Button
            variant="ghost"
            onPress={enableLocation}
            disabled={isFetching}
          >
            <Text>{isFetching ? 'checking...' : "i've enabled it"}</Text>
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
  );
}
