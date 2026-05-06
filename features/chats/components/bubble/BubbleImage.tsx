import { lightbox } from '@/lib/lightbox';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';

interface BubbleImageProps {
  uri: string;
  width: number;
}

export function BubbleImage({ uri, width }: BubbleImageProps) {
  return (
    <Pressable
      className="relative"
      onPress={() => lightbox.open([uri])}
    >
      <Image
        source={{ uri }}
        style={{ width, aspectRatio: 1, borderRadius: 12 }}
        className="bg-muted"
        contentFit="cover"
      />
    </Pressable>
  );
}
