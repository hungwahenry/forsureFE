import Constants from 'expo-constants';
import * as Device from 'expo-device';
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

function easProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId
  );
}

export function useRegisterPushToken(authenticated: boolean): void {
  React.useEffect(() => {
    if (!authenticated) return;
    void register();
    const sub = Notifications.addPushTokenListener(() => {
      void register();
    });
    return () => sub.remove();
  }, [authenticated]);
}

async function sendToBackend(
  args: Parameters<typeof registerDevice>[0],
): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await registerDevice(args);
      return;
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
}

async function register(): Promise<void> {
  if (!Device.isDevice) {
    log('skipping — push tokens are unavailable on simulators');
    return;
  }
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

    const projectId = easProjectId();
    const tokenRes = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    const token = tokenRes.data;
    if (!token) {
      log('no token returned');
      return;
    }

    await sendToBackend({ token, platform: platform() });
    await setStoredPushToken(token);
    log('registered', token);
  } catch (err) {
    log('failed', err);
  }
}
