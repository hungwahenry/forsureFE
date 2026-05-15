import '@/global.css';
import { Sentry } from '@/lib/sentry';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { ConfigBootstrapper } from '@/features/config/components/ConfigBootstrapper';
import { FeatureFlagsBootstrapper } from '@/features/feature-flags/components/FeatureFlagsBootstrapper';
import { useHapticsStore } from '@/features/settings/stores/hapticsStore';
import { OfflineBanner } from '@/components/ui/offline-banner';
import { useThemeStore } from '@/features/settings/stores/themeStore';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

export { ErrorBoundary } from 'expo-router';

void SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { colorScheme } = useColorScheme();
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const themeHydrated = useThemeStore((s) => s.hydrated);
  const bootstrapTheme = useThemeStore((s) => s.bootstrap);
  const hapticsHydrated = useHapticsStore((s) => s.hydrated);
  const bootstrapHaptics = useHapticsStore((s) => s.bootstrap);
  const fontsLoaded = useBrandFonts();

  useEffect(() => {
    void bootstrap();
    void bootstrapTheme();
    void bootstrapHaptics();
  }, [bootstrap, bootstrapTheme, bootstrapHaptics]);

  useEffect(() => {
    if (
      status !== 'bootstrapping' &&
      fontsLoaded &&
      themeHydrated &&
      hapticsHydrated
    ) {
      void SplashScreen.hideAsync();
    }
  }, [status, fontsLoaded, themeHydrated, hapticsHydrated]);

  if (
    status === 'bootstrapping' ||
    !fontsLoaded ||
    !themeHydrated ||
    !hapticsHydrated
  )
    return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <FeatureFlagsBootstrapper />
          <ConfigBootstrapper />
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }} />
            <OfflineBanner />
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

export default Sentry.wrap(RootLayout);
