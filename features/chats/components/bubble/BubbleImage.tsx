import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { lightbox } from '@/lib/lightbox';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

interface BubbleImageProps {
  uri: string;
  width: number;
  pending: boolean;
}

export function BubbleImage({ uri, width, pending }: BubbleImageProps) {
  return (
    <Pressable
      className="relative"
      onPress={pending ? undefined : () => lightbox.open([uri])}
    >
      <Image
        source={{ uri }}
        style={{ width, aspectRatio: 1, borderRadius: 12 }}
        className="bg-muted"
        contentFit="cover"
      />
      {pending ? (
        <View
          className="absolute inset-0 items-center justify-center bg-black/30"
          style={{ borderRadius: 12 }}
        >
          <LoadingIndicator size={8} />
        </View>
      ) : null}
    </Pressable>
  );
}
