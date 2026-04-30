import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export default function ChatScreen() {
  return (
    <Screen edges={['top']} noKeyboardAvoidance>
      <View className="flex-1 items-center justify-center gap-2 p-6">
        <Text className="text-foreground text-3xl font-bold">chat</Text>
        <Text className="text-muted-foreground">
          (coming soon)
        </Text>
      </View>
    </Screen>
  );
}
