import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { useDeviceLocation } from '@/lib/hooks/useDeviceLocation';
import {
  openSystemSettings,
  type ResolvedLocation,
} from '@/lib/permissions/location';
import { Location } from 'iconsax-react-nativejs';
import * as React from 'react';
import { View } from 'react-native';

interface FeedLocationGateProps {
  children: (location: ResolvedLocation) => React.ReactNode;
}

export function FeedLocationGate({ children }: FeedLocationGateProps) {
  const { permission, location, isFetching, error, fetch } = useDeviceLocation({
    autoFetchIfGranted: true,
  });

  if (permission === null) return null;

  if (permission === 'denied') {
    return (
      <EmptyState
        icon={Location}
        title="location is off"
        subtitle="forsure shows activities near you. enable location to see what's nearby."
        actions={
          <Button onPress={openSystemSettings} size="lg">
            <Text>open settings</Text>
          </Button>
        }
      />
    );
  }

  if (permission === 'undetermined') {
    return (
      <EmptyState
        icon={Location}
        title="share your location"
        subtitle="we use it to find activities nearby. you can revoke this any time in settings."
        actions={
          <Button
            onPress={() => void fetch()}
            size="lg"
            disabled={isFetching}
          >
            <Text>turn on location</Text>
          </Button>
        }
      />
    );
  }

  if (error && !location) {
    return (
      <EmptyState
        icon={Location}
        title="couldn't get your location"
        subtitle="check that location services are on, then try again."
        actions={
          <Button onPress={() => void fetch()} size="lg" disabled={isFetching}>
            <Text>{isFetching ? 'trying...' : 'try again'}</Text>
          </Button>
        }
      />
    );
  }

  if (location === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingIndicator size={10} />
      </View>
    );
  }

  return <>{children(location)}</>;
}
