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
  /** Dot diameter in pixels. Default 8. */
  size?: number;
  /** Dot color. Defaults to the brand `primary`. */
  color?: string;
  /** Number of dots. Default 3. */
  count?: number;
  /** Tailwind classes for the container row. */
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

/**
 * App-wide loading indicator. Three dots pulsing with a staggered scale —
 * lower-key than a spinning ring, plays nicely with our rounded UI vocabulary.
 *
 * @example
 *   <LoadingIndicator />
 *   <LoadingIndicator size={12} className="my-6" />
 *   <LoadingIndicator color="white" />   // override on dark surfaces
 */
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
