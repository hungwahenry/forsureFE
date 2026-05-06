import type { ExpoConfig } from 'expo/config';

const googleMapsAndroidKey = process.env.GOOGLE_MAPS_ANDROID_KEY;

if (!googleMapsAndroidKey) {
  if (process.env.EAS_BUILD || process.env.EXPO_PREBUILD) {
    throw new Error(
      'GOOGLE_MAPS_ANDROID_KEY is required for prebuild / EAS build. Set it in .env or as an EAS secret.',
    );
  }
}

const config: ExpoConfig = {
  name: 'forsure',
  slug: 'forsure',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'forsure',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'fyi.forsure',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      dark: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#0d1615',
      },
    },
  },
  android: {
    package: 'fyi.forsure',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      dark: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#0d1615',
      },
    },
    config: {
      googleMaps: {
        apiKey: googleMapsAndroidKey ?? '',
      },
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    '@react-native-community/datetimepicker',
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow forsure to pick a profile photo from your library.',
        cameraPermission:
          'Allow forsure to take a profile photo with your camera.',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'forsure uses your location to find activities near you.',
      },
    ],
    'expo-font',
    'expo-image',
    [
      'expo-media-library',
      {
        photosPermission:
          'Allow forsure to save activity share cards to your photos.',
        savePhotosPermission:
          'Allow forsure to save activity share cards to your photos.',
        isAccessMediaLocationEnabled: false,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
