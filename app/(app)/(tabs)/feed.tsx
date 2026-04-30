import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import { useRouter } from 'expo-router';
import { Add } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function FeedScreen() {
  const router = useRouter();

  const openCreate = () => {
    haptics.press();
    router.push('/create-activity');
  };

  return (
    <Screen edges={['top']} noKeyboardAvoidance>
      <View className="flex-1 items-center justify-center gap-2 p-6">
        <Text className="text-foreground text-3xl font-bold">feed</Text>
        <Text className="text-muted-foreground">
          (stub — activities live here next sprint)
        </Text>
      </View>

      <Pressable
        onPress={openCreate}
        className="bg-primary absolute bottom-6 right-6 size-16 items-center justify-center rounded-full shadow-lg shadow-black/20"
        accessibilityRole="button"
        accessibilityLabel="Create activity"
      >
        <Icon as={Add} className="text-primary-foreground size-8" />
      </Pressable>
    </Screen>
  );
}
