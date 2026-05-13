import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { formatDistance } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import { Shop } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';
import type { BusinessVenueSuggestion } from '../types';

interface Props {
  venues: BusinessVenueSuggestion[];
  onSelect: (venue: BusinessVenueSuggestion) => void;
  disabled: boolean;
}

export function BusinessVenueSuggestions({
  venues,
  onSelect,
  disabled,
}: Props) {
  return (
    <View className="pb-2 pt-4">
      <View className="flex-row items-center justify-between px-2 pb-2">
        <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          suggested for you
        </Text>
      </View>
      {venues.map((venue) => (
        <SponsoredRow
          key={venue.venueId}
          venue={venue}
          onPress={() => onSelect(venue)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

interface RowProps {
  venue: BusinessVenueSuggestion;
  onPress: () => void;
  disabled: boolean;
}

function SponsoredRow({ venue, onPress, disabled }: RowProps) {
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
      {venue.businessLogoUrl ? (
        <Image
          source={{ uri: venue.businessLogoUrl }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
          contentFit="cover"
        />
      ) : (
        <View className="bg-secondary size-10 items-center justify-center rounded-full">
          <Icon as={Shop} className="text-secondary-foreground size-5" />
        </View>
      )}
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className="text-foreground flex-shrink text-base font-medium"
          >
            {venue.placeName}
          </Text>
          <Badge variant="secondary">
            <Text>sponsored</Text>
          </Badge>
        </View>
        <Text numberOfLines={1} className="text-muted-foreground text-sm">
          {venue.businessName} · {formatDistance(venue.distanceM / 1000)} away
        </Text>
      </View>
    </Pressable>
  );
}
