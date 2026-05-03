import { Icon } from '@/components/ui/icon';
import { CloseCircle } from 'iconsax-react-nativejs';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

interface PendingImagePreviewProps {
  uri: string;
  onClear: () => void;
}

export function PendingImagePreview({ uri, onClear }: PendingImagePreviewProps) {
  return (
    <View className="border-border/40 bg-muted/40 flex-row items-center gap-3 border-t px-4 py-3">
      <View style={{ width: 64, height: 64 }}>
        <Image
          source={{ uri }}
          style={{ width: 64, height: 64, borderRadius: 6 }}
          className="bg-muted"
          contentFit="cover"
        />
        <Pressable
          onPress={onClear}
          hitSlop={6}
          className="absolute -right-1 -top-1"
        >
          <Icon as={CloseCircle} className="text-foreground size-5" variant="Bold" />
        </Pressable>
      </View>
    </View>
  );
}
