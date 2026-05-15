import * as Notifications from 'expo-notifications';
import * as React from 'react';
import { Platform } from 'react-native';
import { registerDevice } from '../api/devices';
import { ensureAndroidNotificationChannel } from '../setup';
import { setStoredPushToken } from '../storage';
import type { DevicePlatform } from '../types';

const log = (...args: unknown[]) => console.log('[push]', ...args);

function platform(): DevicePlatform {
  if (Platform.OS === 'ios') return 'IOS';
  if (Platform.OS === 'android') return 'ANDROID';
  return 'WEB';
}

export function useRegisterPushToken(authenticated: boolean): void {
  React.useEffect(() => {
    if (!authenticated) return;
    void register();
  }, [authenticated]);
}

async function register(): Promise<void> {
  try {
    await ensureAndroidNotificationChannel();

    let granted = (await Notifications.getPermissionsAsync()).granted;
    if (!granted) {
      granted = (await Notifications.requestPermissionsAsync()).granted;
    }
    if (!granted) {
      log('permission denied');
      return;
    }

    const tokenRes = await Notifications.getExpoPushTokenAsync();
    const token = tokenRes.data;
    if (!token) {
      log('no token returned');
      return;
    }

    await registerDevice({ token, platform: platform() });
    await setStoredPushToken(token);
    log('registered', token);
  } catch (err) {
    log('failed', err);
  }
}
