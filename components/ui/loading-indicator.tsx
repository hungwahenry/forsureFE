import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface LoadingIndicatorProps {
  /** Dot diameter in pixels. */
  size?: number;
  /** Defaults to brand primary. */
  color?: string;
  count?: number;
  className?: string;
}

const DURATION = 480;
const STAGGER = 140;
const MIN_SCALE = 0.45;

interface DotProps {
  delay: number;
  size: number;
  color: string;
}

function Dot({ delay, size, color }: DotProps) {
  const scale = useSharedValue(MIN_SCALE);

  React.useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: DURATION }),
          withTiming(MIN_SCALE, { duration: DURATION })
        ),
        -1,
        false
      )
    );
  }, [delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function LoadingIndicator({
  size = 8,
  color,
  count = 3,
  className,
}: LoadingIndicatorProps) {
  const { colorScheme } = useColorScheme();
  const resolvedColor =
    color ?? THEME[colorScheme === 'dark' ? 'dark' : 'light'].primary;

  return (
    <View
      className={cn('flex-row items-center gap-2', className)}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Dot
          key={i}
          delay={i * STAGGER}
          size={size}
          color={resolvedColor}
        />
      ))}
    </View>
  );
}
