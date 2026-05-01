import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Flag } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

interface ReportActivityButtonProps {
  activityId: string;
}

export function ReportActivityButton({ activityId }: ReportActivityButtonProps) {
  const router = useRouter();
  return (
    <View className="items-center px-6 pb-6">
      <Pressable
        hitSlop={8}
        onPress={() =>
          router.push({
            pathname: '/report',
            params: { targetType: 'ACTIVITY', targetId: activityId },
          })
        }
        className="flex-row items-center gap-1.5"
      >
        <Icon as={Flag} className="text-muted-foreground size-3" />
        <Text className="text-muted-foreground text-xs underline">
          report this activity
        </Text>
      </Pressable>
    </View>
  );
}
