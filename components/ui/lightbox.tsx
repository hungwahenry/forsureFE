import { Icon } from '@/components/ui/icon';
import { useLightboxStore } from '@/lib/lightbox';
import { Image } from 'expo-image';
import { CloseCircle } from 'iconsax-react-nativejs';
import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Lightbox() {
  const images = useLightboxStore((s) => s.images);
  const initialIndex = useLightboxStore((s) => s.initialIndex);
  const close = useLightboxStore((s) => s.close);
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const [index, setIndex] = React.useState(initialIndex);
  const listRef = React.useRef<FlatList<string>>(null);

  const open = images !== null;

  React.useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={close}
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black">
        <Pressable
          onPress={close}
          hitSlop={12}
          className="absolute z-10"
          style={{ top: insets.top + 8, right: 16 }}
        >
          <Icon as={CloseCircle} className="size-8 text-white" variant="Bold" />
        </Pressable>

        {images ? (
          <FlatList
            ref={listRef}
            data={images}
            keyExtractor={(uri, i) => `${uri}-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({ item }) => (
              <Pressable
                onPress={close}
                style={{ width, height }}
                className="items-center justify-center"
              >
                <Image
                  source={{ uri: item }}
                  style={{ width, height: height * 0.85 }}
                  contentFit="contain"
                  transition={120}
                />
              </Pressable>
            )}
          />
        ) : null}

        {images && images.length > 1 ? (
          <View
            className="absolute left-0 right-0 flex-row items-center justify-center gap-1.5"
            style={{ bottom: insets.bottom + 16 }}
          >
            {images.map((uri, i) => (
              <View
                key={`${uri}-dot-${i}`}
                className={`size-1.5 rounded-full ${
                  i === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
