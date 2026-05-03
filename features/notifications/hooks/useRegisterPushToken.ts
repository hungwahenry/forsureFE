import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as React from 'react';
import { Platform } from 'react-native';
import { registerDevice } from '../api/devices';
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
  if (!Device.isDevice) {
    log('skipping: not a physical device');
    return;
  }

  try {
    let granted = (await Notifications.getPermissionsAsync()).granted;
    if (!granted) {
      granted = (await Notifications.requestPermissionsAsync()).granted;
    }
    if (!granted) {
      log('permission denied');
      return;
    }

    const projectId =
      // EAS-built apps expose projectId via Constants; fall back to env when absent.
      // expo-notifications reads it automatically if omitted, but being explicit
      // avoids cryptic warnings in dev clients.
      undefined;
    const tokenRes = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    const token = tokenRes.data;
    if (!token) {
      log('no token returned');
      return;
    }

    await registerDevice({ token, platform: platform() });
    await setStoredPushToken(token);
    log('registered');
  } catch (err) {
    log('failed', err);
  }
}
