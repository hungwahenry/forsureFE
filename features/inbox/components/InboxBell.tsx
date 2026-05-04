import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import { THEME } from '@/lib/theme';
import { useRouter } from 'expo-router';
import { Notification } from 'iconsax-react-nativejs';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';
import { useUnreadCount } from '../api/inbox';

export function InboxBell() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const { data: count } = useUnreadCount();
  const hasUnread = (count ?? 0) > 0;

  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        router.push('/notifications' as never);
      }}
      hitSlop={8}
      className="items-center justify-center"
    >
      <View>
        <Icon as={Notification} className="text-muted-foreground size-7" />
        {hasUnread ? (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -6,
              minWidth: 18,
              height: 18,
              paddingHorizontal: 5,
              borderRadius: 9,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              className="text-primary-foreground text-[10px] font-bold"
              numberOfLines={1}
            >
              {(count ?? 0) > 99 ? '99+' : String(count)}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
