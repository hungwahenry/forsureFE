import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

const WORDMARK = require('@/assets/images/wordmark.png');
const ASPECT_RATIO = 1800 / 500;

interface WordmarkProps {
  height: number;
  style?: StyleProp<ImageStyle>;
}

export function Wordmark({ height, style }: WordmarkProps) {
  return (
    <Image
      source={WORDMARK}
      accessibilityLabel="forsure"
      contentFit="contain"
      style={[{ height, width: height * ASPECT_RATIO }, style]}
    />
  );
}
