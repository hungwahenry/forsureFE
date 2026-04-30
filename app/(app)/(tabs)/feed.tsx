import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { FeedList } from '@/features/feed/components/FeedList';
import { FeedLocationGate } from '@/features/feed/components/FeedLocationGate';
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
      <View className="px-6 pb-3 pt-2">
        <Text className="text-foreground text-3xl font-bold">stuff to do</Text>
      </View>

      <FeedLocationGate>
        {(location) => <FeedList lat={location.lat} lng={location.lng} />}
      </FeedLocationGate>

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
