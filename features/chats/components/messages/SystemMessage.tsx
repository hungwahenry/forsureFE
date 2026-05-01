import { Text } from '@/components/ui/text';
import { View } from 'react-native';

interface SystemMessageProps {
  body: string;
}

export function SystemMessage({ body }: SystemMessageProps) {
  return (
    <View className="items-center px-6 py-1.5">
      <Text className="text-muted-foreground text-center text-xs italic">
        {body}
      </Text>
    </View>
  );
}
