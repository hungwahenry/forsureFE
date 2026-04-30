import { THEME } from '@/lib/theme';
import { Tabs } from 'expo-router';
import { Home2, Message, Profile } from 'iconsax-react-nativejs';
import { useColorScheme } from 'nativewind';

const TAB_ICON_SIZE = 30;

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

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
            <Message
              color={color}
              size={TAB_ICON_SIZE}
              variant={focused ? 'Bold' : 'Linear'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
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
