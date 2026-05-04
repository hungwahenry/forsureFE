import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useHapticsStore } from '@/features/settings/stores/hapticsStore';
import { haptics } from '@/lib/haptics';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function HapticsScreen() {
  const router = useRouter();
  const enabled = useHapticsStore((s) => s.enabled);
  const setEnabled = useHapticsStore((s) => s.setEnabled);

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          haptics
        </Text>
        <View className="size-7" />
      </View>

      <View className="px-6 pt-4">
        <View className="border-border/40 flex-row items-center gap-3 border-b py-4">
          <View className="flex-1">
            <Text className="text-foreground text-base">vibration</Text>
            <Text className="text-muted-foreground mt-0.5 text-sm">
              subtle feedback when you tap, toggle, or confirm.
            </Text>
          </View>
          <Switch
            checked={enabled}
            onCheckedChange={(next) => {
              void setEnabled(next).then(() => {
                if (next) haptics.selection();
              });
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
