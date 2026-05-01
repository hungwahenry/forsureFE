import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Edit2, Slash } from 'iconsax-react-nativejs';
import { View } from 'react-native';
import type { ActivityStatus } from '../../types';

interface HostActionsProps {
  status: ActivityStatus;
  onEdit: () => void;
  onCancel: () => void;
}

export function HostActions({ status, onEdit, onCancel }: HostActionsProps) {
  const editable = status === 'OPEN';
  const cancelable = status === 'OPEN' || status === 'FULL';

  return (
    <View className="px-6 pb-6 pt-4">
      <Text className="text-muted-foreground pb-2 text-xs font-semibold uppercase">
        host actions
      </Text>
      <View className="gap-2">
        <Button onPress={onEdit} disabled={!editable} variant="outline">
          <Icon as={Edit2} className="size-4" />
          <Text>edit activity</Text>
        </Button>
        <Button onPress={onCancel} disabled={!cancelable} variant="destructive">
          <Icon as={Slash} className="size-4" />
          <Text>cancel activity</Text>
        </Button>
      </View>
    </View>
  );
}
