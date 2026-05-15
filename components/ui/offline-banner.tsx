import { Text } from '@/components/ui/text';
import { useIsOnline } from '@/lib/net';
import { MotiView } from 'moti';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Thin bar pinned under the notch while the device has no connection. */
export function OfflineBanner() {
  const online = useIsOnline();
  const insets = useSafeAreaInsets();

  if (online) return null;

  return (
    <MotiView
      from={{ translateY: -64 }}
      animate={{ translateY: 0 }}
      transition={{ type: 'timing', duration: 220 }}
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}
    >
      <View className="bg-foreground" style={{ paddingTop: insets.top }}>
        <Text className="text-background py-1.5 text-center text-xs font-medium">
          you&apos;re offline
        </Text>
      </View>
    </MotiView>
  );
}
