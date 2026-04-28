import '@/global.css';
// Must be first — react-native-gesture-handler patches global state.
import 'react-native-gesture-handler';

// Importing the auth store registers the API client's auth handlers as a
// side-effect — must happen before any HTTP request is made.
import { useAuthStore } from '@/features/auth/stores/authStore';
import { queryClient } from '@/lib/api/queryClient';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (status !== 'bootstrapping') {
      void SplashScreen.hideAsync();
    }
  }, [status]);

  // Hold render until bootstrap resolves so route guards can read a
  // settled auth status from the store on first paint.
  if (status === 'bootstrapping') return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack />
          <Toaster
            theme={colorScheme ?? 'light'}
            richColors
            closeButton
            position="top-center"
          />
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
