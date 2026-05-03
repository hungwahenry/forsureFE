import '@/global.css';
// Must be first — patches global state.
import 'react-native-gesture-handler';

// Side-effect import: registers API client auth handlers before any request.
import { useAuthStore } from '@/features/auth/stores/authStore';
import { queryClient } from '@/lib/api/queryClient';
import { useBrandFonts } from '@/lib/fonts';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

export { ErrorBoundary } from 'expo-router';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const fontsLoaded = useBrandFonts();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (status !== 'bootstrapping' && fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [status, fontsLoaded]);

  // Block first paint until bootstrap settles and fonts are loaded.
  if (status === 'bootstrapping' || !fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }} />
            <Toaster
              theme={colorScheme ?? 'light'}
              richColors
              closeButton
              position="top-center"
            />
            <PortalHost />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
