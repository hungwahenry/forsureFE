import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Image } from 'expo-image';
import { View } from 'react-native';

interface BubbleImageProps {
  uri: string;
  width: number;
  pending: boolean;
}

export function BubbleImage({ uri, width, pending }: BubbleImageProps) {
  return (
    <View className="relative">
      <Image
        source={{ uri }}
        style={{ width, aspectRatio: 1 }}
        className="bg-muted rounded-xl"
        contentFit="cover"
      />
      {pending ? (
        <View className="absolute inset-0 items-center justify-center rounded-xl bg-black/30">
          <LoadingIndicator size={8} />
        </View>
      ) : null}
    </View>
  );
}
