import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { ApiError } from '@/lib/api/types';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import {
  checkLocationPermission,
  getCurrentLocation,
} from '@/lib/permissions/location';
import { THEME } from '@/lib/theme';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { Location, SearchNormal1 } from 'iconsax-react-nativejs';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useSuggestPlaces } from '../api/suggest';
import { usePickPlace } from '../hooks/usePickPlace';
import { usePlaceSearchSession } from '../hooks/usePlaceSearchSession';
import type { PickedPlace, PlaceSuggestion } from '../types';

interface PlacePickerProps {
  /** Fired after a successful suggest → retrieve cycle. */
  onSelect: (place: PickedPlace) => void;
}

export const PlacePicker = React.forwardRef<
  BottomSheetModal,
  PlacePickerProps
>(function PlacePicker({ onSelect }, ref) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  const { sessionToken, renewSession } = usePlaceSearchSession();
  const { pickPlace, isPending: isPicking } = usePickPlace({
    sessionToken,
    onSessionUsed: renewSession,
  });

  const [query, setQuery] = React.useState('');
  const debounced = useDebouncedValue(query.trim(), 300);
  const [proximity, setProximity] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const status = await checkLocationPermission();
      if (status !== 'granted' || cancelled) return;
      try {
        const loc = await getCurrentLocation();
        if (!cancelled) setProximity({ lat: loc.lat, lng: loc.lng });
      } catch {
        // Best-effort — picker still works without proximity.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = useSuggestPlaces({
    q: debounced,
    proximity: proximity ?? undefined,
    sessionToken,
    enabled: debounced.length > 0,
  });

  const onPick = async (suggestion: PlaceSuggestion) => {
    try {
      const place = await pickPlace(suggestion);
      onSelect(place);
      setQuery('');
      (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "couldn't fetch that place. try another.";
      toast.error(message);
    }
  };

  return (
    <BottomSheet ref={ref} snapPoints={['80%']} enableDynamicSizing={false}>
      <View className="flex-1 px-4">
        <View className="border-foreground/15 bg-muted/40 mb-3 h-12 flex-row items-center gap-2 rounded-full border-2 px-4">
          <Icon
            as={SearchNormal1}
            className="text-muted-foreground size-5"
          />
          <BottomSheetTextInput
            placeholder="search for a venue..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            style={{
              flex: 1,
              color: colors.foreground,
              fontSize: 16,
            }}
          />
        </View>

        {suggestions.isFetching ? (
          <View className="items-center py-6">
            <LoadingIndicator size={8} />
          </View>
        ) : null}

        <BottomSheetFlatList
          data={suggestions.data ?? []}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            !suggestions.isFetching && debounced.length > 0 ? (
              <Text className="text-muted-foreground py-6 text-center">
                no results.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onPick(item)}
              disabled={isPicking}
              className={cn(
                'flex-row items-center gap-3 rounded-2xl px-3 py-3',
                'active:bg-muted/60'
              )}
            >
              <View className="bg-primary/10 size-10 items-center justify-center rounded-full">
                <Icon as={Location} className="text-primary size-5" />
              </View>
              <View className="flex-1">
                <Text
                  numberOfLines={1}
                  className="text-foreground text-base font-medium"
                >
                  {item.name}
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-muted-foreground text-sm"
                >
                  {item.description}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </BottomSheet>
  );
});
