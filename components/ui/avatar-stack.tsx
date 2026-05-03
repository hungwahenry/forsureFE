import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Image } from 'expo-image';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

interface AvatarStackProps {
  uris: string[];
  size?: number;
  overlap?: number;
  overflow?: number;
}

export function AvatarStack({
  uris,
  size = 28,
  overlap = 10,
  overflow = 0,
}: AvatarStackProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const ringColor = colors.background;

  return (
    <View className="flex-row items-center">
      {uris.map((uri, i) => (
        <Image
          key={`${uri}-${i}`}
          source={{ uri }}
          className="bg-muted"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: i === 0 ? 0 : -overlap,
            borderWidth: 2,
            borderColor: ringColor,
          }}
        />
      ))}
      {overflow > 0 ? (
        <View
          className="bg-muted items-center justify-center"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: -overlap,
            borderWidth: 2,
            borderColor: ringColor,
          }}
        >
          <Text className="text-muted-foreground text-xs font-semibold">
            +{overflow}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
