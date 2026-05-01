import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ExploreList } from '@/features/explore/components/ExploreList';
import { FeedLocationGate } from '@/features/feed/components/FeedLocationGate';
import { View } from 'react-native';

export default function ExploreScreen() {
  return (
    <Screen edges={['top']} noKeyboardAvoidance>
      <View className="px-6 pb-3 pt-2">
        <Text className="text-foreground text-3xl font-bold">explore</Text>
      </View>
      <FeedLocationGate>
        {(location) => (
          <ExploreList lat={location.lat} lng={location.lng} />
        )}
      </FeedLocationGate>
    </Screen>
  );
}
