import { useAuthStore } from '@/features/auth/stores/authStore';
import { useListChats } from '@/features/chats/api/listChats';
import { THEME } from '@/lib/theme';
import { Tabs } from 'expo-router';
import { Home2, Message, Profile } from 'iconsax-react-nativejs';
import { useColorScheme } from 'nativewind';
import { Image } from 'expo-image';
import { View } from 'react-native';

const TAB_ICON_SIZE = 30;

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const avatarUrl = useAuthStore((s) => s.user?.avatarUrl);
  const { data: chats } = useListChats();
  const hasUnread = (chats ?? []).some((c) => c.unreadCount > 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home2
              color={color}
              size={TAB_ICON_SIZE}
              variant={focused ? 'Bold' : 'Linear'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Message
                color={color}
                size={TAB_ICON_SIZE}
                variant={focused ? 'Bold' : 'Linear'}
              />
              {hasUnread ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: colors.primary,
                  }}
                />
              ) : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) =>
            avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{
                  width: TAB_ICON_SIZE,
                  height: TAB_ICON_SIZE,
                  borderRadius: TAB_ICON_SIZE / 2,
                  borderWidth: focused ? 2 : 0,
                  borderColor: colors.primary,
                }}
              />
            ) : (
              <Profile
                color={color}
                size={TAB_ICON_SIZE}
                variant={focused ? 'Bold' : 'Linear'}
              />
            ),
        }}
      />
    </Tabs>
  );
}
