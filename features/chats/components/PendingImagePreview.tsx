import { Icon } from '@/components/ui/icon';
import { CloseCircle } from 'iconsax-react-nativejs';
import { Image, Pressable, View } from 'react-native';

interface PendingImagePreviewProps {
  uri: string;
  onClear: () => void;
}

export function PendingImagePreview({ uri, onClear }: PendingImagePreviewProps) {
  return (
    <View className="border-border/40 bg-muted/40 flex-row items-center gap-3 border-t px-4 py-3">
      <Image
        source={{ uri }}
        className="bg-muted size-16 rounded-md"
        resizeMode="cover"
      />
      <Pressable onPress={onClear} hitSlop={8}>
        <Icon as={CloseCircle} className="text-muted-foreground size-5" />
      </Pressable>
    </View>
  );
}
