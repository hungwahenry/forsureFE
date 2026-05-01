import { Text } from '@/components/ui/text';
import { formatChatDate } from '@/lib/format';
import { View } from 'react-native';

export function MessageSeparator({ when }: { when: Date }) {
  return (
    <View className="items-center py-3">
      <Text className="text-muted-foreground text-xs">
        {formatChatDate(when)}
      </Text>
    </View>
  );
}
