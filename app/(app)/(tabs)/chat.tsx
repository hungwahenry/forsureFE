import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ChatList } from '@/features/chats/components/ChatList';
import { View } from 'react-native';

export default function ChatScreen() {
  return (
    <Screen edges={['top']} noKeyboardAvoidance>
      <View className="px-6 pb-3 pt-2">
        <Text className="text-foreground text-3xl font-bold">chats</Text>
      </View>
      <ChatList />
    </Screen>
  );
}
