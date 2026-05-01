import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Image } from 'expo-image';
import { CloseCircle, Gallery } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';
import {
  POST_MAX_PHOTOS,
  type ComposePhoto,
} from '../hooks/useComposePost';

const TILE_SIZE = 96;

interface PhotoGridProps {
  photos: ComposePhoto[];
  remainingSlots: number;
  onAdd: () => void;
  onRemove: (photo: ComposePhoto) => void;
}

export function PhotoGrid({
  photos,
  remainingSlots,
  onAdd,
  onRemove,
}: PhotoGridProps) {
  return (
    <>
      <View className="mb-2 flex-row flex-wrap gap-2">
        {photos.map((p) => (
          <PhotoTile
            key={p.kind === 'existing' ? p.id : p.localId}
            uri={p.uri}
            onRemove={() => onRemove(p)}
          />
        ))}
        {remainingSlots > 0 ? (
          <Pressable
            onPress={onAdd}
            className="border-border bg-muted/30 items-center justify-center rounded-md border border-dashed"
            style={{ width: TILE_SIZE, height: TILE_SIZE }}
          >
            <Icon as={Gallery} className="text-muted-foreground size-6" />
            <Text className="text-muted-foreground mt-1 text-[10px]">
              add ({remainingSlots})
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="text-muted-foreground mb-4 text-xs">
        up to {POST_MAX_PHOTOS} photos
      </Text>
    </>
  );
}

function PhotoTile({
  uri,
  onRemove,
}: {
  uri: string;
  onRemove: () => void;
}) {
  return (
    <View style={{ width: TILE_SIZE, height: TILE_SIZE }}>
      <Image
        source={{ uri }}
        style={{ width: TILE_SIZE, height: TILE_SIZE, borderRadius: 8 }}
        className="bg-muted"
      />
      <Pressable
        hitSlop={6}
        onPress={onRemove}
        className="absolute -right-1 -top-1"
      >
        <Icon
          as={CloseCircle}
          className="text-foreground size-5"
          variant="Bold"
        />
      </Pressable>
    </View>
  );
}
