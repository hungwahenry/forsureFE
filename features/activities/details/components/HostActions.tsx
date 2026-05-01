import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
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
          <Text>edit activity</Text>
        </Button>
        <Button onPress={onCancel} disabled={!cancelable} variant="destructive">
          <Text>cancel activity</Text>
        </Button>
      </View>
    </View>
  );
}
