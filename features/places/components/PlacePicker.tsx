import { ApiError } from '@/lib/api/types';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useDeviceLocation } from '@/lib/hooks/useDeviceLocation';
import { toast } from '@/lib/toast';
import * as React from 'react';
import { View } from 'react-native';
import { useSuggestPlaces } from '../api/suggest';
import { usePickPlace } from '../hooks/usePickPlace';
import { usePlaceSearchSession } from '../hooks/usePlaceSearchSession';
import type { PickedPlace, PlaceSuggestion } from '../types';
import { PlaceResultsList } from './PlaceResultsList';
import { PlaceSearchBar } from './PlaceSearchBar';

interface PlacePickerProps {
  /** Fired after a successful suggest → retrieve cycle. */
  onSelect: (place: PickedPlace) => void;
}

export function PlacePicker({ onSelect }: PlacePickerProps) {
  const { sessionToken, renewSession } = usePlaceSearchSession();
  const { pickPlace, isPending: isPicking } = usePickPlace({
    sessionToken,
    onSessionUsed: renewSession,
  });

  const [query, setQuery] = React.useState('');
  const debounced = useDebouncedValue(query.trim(), 300);
  const { location } = useDeviceLocation({ autoFetchIfGranted: true });

  const suggestions = useSuggestPlaces({
    q: debounced,
    proximity: location ? { lat: location.lat, lng: location.lng } : undefined,
    sessionToken,
    enabled: debounced.length > 0,
  });

  const onPick = async (suggestion: PlaceSuggestion) => {
    try {
      const place = await pickPlace(suggestion);
      onSelect(place);
      setQuery('');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "couldn't fetch that place. try another.";
      toast.error(message);
    }
  };

  // Loading covers both the in-flight fetch and the debounce gap.
  const isLoading =
    suggestions.isFetching || (query.trim().length > 0 && debounced.length === 0);

  return (
    <View className="flex-1">
      <PlaceSearchBar
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
        autoFocus
      />
      <PlaceResultsList
        query={query.trim()}
        data={suggestions.data}
        isLoading={isLoading}
        isPicking={isPicking}
        onSelect={onPick}
      />
    </View>
  );
}
