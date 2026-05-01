import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { LogoutCurve } from 'iconsax-react-nativejs';
import { View } from 'react-native';

interface LeaveButtonProps {
  onLeave: () => void;
  disabled?: boolean;
}

export function LeaveButton({ onLeave, disabled }: LeaveButtonProps) {
  return (
    <View className="px-6 pb-6 pt-4">
      <Button onPress={onLeave} variant="outline" disabled={disabled}>
        <Icon as={LogoutCurve} className="text-destructive size-4" />
        <Text className="text-destructive">leave activity</Text>
      </Button>
    </View>
  );
}
