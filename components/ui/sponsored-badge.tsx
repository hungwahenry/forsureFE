import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import { Shop } from 'iconsax-react-nativejs';
import { View } from 'react-native';

interface SponsoredBadgeProps {
  business?: {
    name: string;
    logoUrl: string | null;
  };
  className?: string;
}

export function SponsoredBadge({ business, className }: SponsoredBadgeProps) {
  if (!business) {
    return (
      <Badge variant="secondary" className={className}>
        <Text>sponsored</Text>
      </Badge>
    );
  }
  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      {business.logoUrl ? (
        <Image
          source={{ uri: business.logoUrl }}
          style={{ width: 18, height: 18, borderRadius: 9 }}
          contentFit="cover"
        />
      ) : (
        <View className="bg-secondary size-[18px] items-center justify-center rounded-full">
          <Icon as={Shop} className="text-secondary-foreground size-3" />
        </View>
      )}
      <Text className="text-muted-foreground text-xs">
        sponsored · {business.name}
      </Text>
    </View>
  );
}
