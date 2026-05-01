import { haptics } from '@/lib/haptics';
import { THEME } from '@/lib/theme';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const TRIGGER_DISTANCE = 60;
const MAX_PULL = 90;
const ICON_SIZE = 20;
const ICON_TRACK_WIDTH = 56;

interface SwipeToReplyProps {
  children: React.ReactNode;
  onReply: () => void;
  disabled?: boolean;
}

export function SwipeToReply({
  children,
  onReply,
  disabled,
}: SwipeToReplyProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const translateX = useSharedValue(0);
  const triggered = useSharedValue(false);

  const fire = React.useCallback(() => {
    haptics.tap();
    onReply();
  }, [onReply]);

  const pan = React.useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-10, 9999])
        .failOffsetY([-12, 12])
        .onUpdate((e) => {
          const next = Math.max(-MAX_PULL, Math.min(0, e.translationX));
          translateX.value = next;
          if (next <= -TRIGGER_DISTANCE && !triggered.value) {
            triggered.value = true;
            scheduleOnRN(fire);
          }
        })
        .onFinalize(() => {
          translateX.value = withTiming(0, {
            duration: 180,
            easing: Easing.out(Easing.cubic),
          });
          triggered.value = false;
        }),
    [disabled, fire, translateX, triggered],
  );

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-TRIGGER_DISTANCE, -10],
      [1, 0],
      'clamp',
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-TRIGGER_DISTANCE, -10],
          [1, 0.6],
          'clamp',
        ),
      },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: ICON_TRACK_WIDTH,
              alignItems: 'center',
              justifyContent: 'center',
            },
            iconStyle,
          ]}
        >
          <ArrowLeft size={ICON_SIZE} color={colors.mutedForeground} />
        </Animated.View>
        <Animated.View style={contentStyle}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
