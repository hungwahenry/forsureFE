import { ApiError } from '@/lib/api/types';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useDeviceLocation } from '@/lib/hooks/useDeviceLocation';
import { toast } from '@/lib/toast';
import * as React from 'react';
import { View } from 'react-native';
import { useBusinessSuggestions } from '../api/businessSuggestions';
import { useRecordVenuePick } from '../api/recordVenuePick';
import { useSuggestPlaces } from '../api/suggest';
import { usePickPlace } from '../hooks/usePickPlace';
import { usePlaceSearchSession } from '../hooks/usePlaceSearchSession';
import type {
  BusinessVenueSuggestion,
  PickedPlace,
  PlaceSuggestion,
} from '../types';
import { PlaceResultsList } from './PlaceResultsList';
import { PlaceSearchBar } from './PlaceSearchBar';

interface PlacePickerProps {
  onSelect: (place: PickedPlace, businessVenueId?: string) => void;
}

export function PlacePicker({ onSelect }: PlacePickerProps) {
  const { sessionToken, renewSession } = usePlaceSearchSession();
  const { pickPlace, isPending: isPicking } = usePickPlace({
    sessionToken,
    onSessionUsed: renewSession,
  });
  const recordVenuePick = useRecordVenuePick();

  const [query, setQuery] = React.useState('');
  const debounced = useDebouncedValue(query.trim(), 300);
  const { location } = useDeviceLocation({ autoFetchIfGranted: true });
  const proximity = location ? { lat: location.lat, lng: location.lng } : null;

  const suggestions = useSuggestPlaces({
    q: debounced,
    proximity: proximity ?? undefined,
    sessionToken,
    enabled: debounced.length > 0,
  });

  const businessSuggestions = useBusinessSuggestions({
    q: debounced,
    proximity,
    enabled: debounced.length > 0,
  });

  const onPickPlace = async (suggestion: PlaceSuggestion) => {
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

  const onPickVenue = (venue: BusinessVenueSuggestion) => {
    recordVenuePick.mutate({ venueId: venue.venueId });
    const place: PickedPlace = {
      name: venue.placeName,
      address: '',
      lat: venue.placeLat,
      lng: venue.placeLng,
    };
    onSelect(place, venue.venueId);
    setQuery('');
  };

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
        onSelect={onPickPlace}
        businessVenues={businessSuggestions.data}
        onSelectVenue={onPickVenue}
      />
    </View>
  );
}
