import * as React from 'react';
import { Image } from 'expo-image';
import {
  Dimensions,
  FlatList,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { ActivityPostPhoto } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 24;
const CAROUSEL_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const CAROUSEL_HEIGHT = Math.round(CAROUSEL_WIDTH * 1.1);

interface PostPhotoCarouselProps {
  photos: ActivityPostPhoto[];
}

export function PostPhotoCarousel({ photos }: PostPhotoCarouselProps) {
  const [index, setIndex] = React.useState(0);

  if (photos.length === 0) return null;

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / CAROUSEL_WIDTH);
    if (next !== index) setIndex(next);
  };

  return (
    <View>
      <FlatList
        data={photos}
        keyExtractor={(p) => p.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: CAROUSEL_WIDTH,
              height: CAROUSEL_HEIGHT,
              borderRadius: 12,
            }}
            className="bg-muted"
            contentFit="cover"
          />
        )}
      />
      {photos.length > 1 ? (
        <View className="mt-2 flex-row items-center justify-center gap-1.5">
          {photos.map((p, i) => (
            <View
              key={p.id}
              className={`size-1.5 rounded-full ${
                i === index ? 'bg-foreground' : 'bg-muted-foreground/40'
              }`}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
