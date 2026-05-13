import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Location, SearchNormal1 } from 'iconsax-react-nativejs';
import { FlatList, Pressable, View } from 'react-native';
import type { BusinessVenueSuggestion, PlaceSuggestion } from '../types';
import { BusinessVenueSuggestions } from './BusinessVenueSuggestions';

interface PlaceResultsListProps {
  query: string;
  data: PlaceSuggestion[] | undefined;
  isLoading: boolean;
  isPicking: boolean;
  onSelect: (suggestion: PlaceSuggestion) => void;
  businessVenues: BusinessVenueSuggestion[] | undefined;
  onSelectVenue: (venue: BusinessVenueSuggestion) => void;
}

export function PlaceResultsList({
  query,
  data,
  isLoading,
  isPicking,
  onSelect,
  businessVenues,
  onSelectVenue,
}: PlaceResultsListProps) {
  const hasVenues = (businessVenues?.length ?? 0) > 0;
  const hasGoogle = (data?.length ?? 0) > 0;

  if (query.length === 0 && !hasVenues) {
    return (
      <EmptyState
        icon={SearchNormal1}
        title="search for a place"
        subtitle="cafes, parks, bars — anywhere people meet."
      />
    );
  }

  if (isLoading && !hasGoogle && !hasVenues) {
    return (
      <View className="items-center pt-12">
        <LoadingIndicator size={8} />
      </View>
    );
  }

  const sponsoredHeader = hasVenues ? (
    <BusinessVenueSuggestions
      venues={businessVenues!}
      onSelect={onSelectVenue}
      disabled={isPicking}
    />
  ) : null;

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 32 }}
      ListHeaderComponent={sponsoredHeader}
      ItemSeparatorComponent={() => (
        <View className="bg-border/60 ml-16 h-px" />
      )}
      ListEmptyComponent={
        query.length === 0 ? (
          <View className="px-2 pt-4">
            <Text className="text-muted-foreground text-xs">
              search to see more places nearby.
            </Text>
          </View>
        ) : (
          <EmptyState
            icon={SearchNormal1}
            title={`no results for "${query}"`}
            subtitle="try a different search term."
          />
        )
      }
      renderItem={({ item }) => (
        <PlaceRow
          suggestion={item}
          onPress={() => onSelect(item)}
          disabled={isPicking}
        />
      )}
    />
  );
}

interface PlaceRowProps {
  suggestion: PlaceSuggestion;
  onPress: () => void;
  disabled: boolean;
}

function PlaceRow({ suggestion, onPress, disabled }: PlaceRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'flex-row items-center gap-3 px-2 py-3',
        'active:bg-muted/40',
        disabled && 'opacity-60',
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
          {suggestion.name}
        </Text>
        <Text numberOfLines={1} className="text-muted-foreground text-sm">
          {suggestion.description}
        </Text>
      </View>
    </Pressable>
  );
}
