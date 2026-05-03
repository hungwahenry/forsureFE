import { api } from '@/lib/api/client';
import type { DevicePlatform } from '../types';

export interface RegisterDeviceArgs {
  token: string;
  platform: DevicePlatform;
}

export async function registerDevice(args: RegisterDeviceArgs): Promise<void> {
  await api.post('/v1/notifications/devices', args);
}

export async function unregisterDevice(token: string): Promise<void> {
  await api.delete(`/v1/notifications/devices/${encodeURIComponent(token)}`);
}
