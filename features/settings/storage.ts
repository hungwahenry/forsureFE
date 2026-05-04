import * as SecureStore from 'expo-secure-store';

const THEME_KEY = 'forsure.theme';
const HAPTICS_KEY = 'forsure.haptics';

export type ThemePreference = 'system' | 'light' | 'dark';

const isThemePreference = (v: string): v is ThemePreference =>
  v === 'system' || v === 'light' || v === 'dark';

export async function getThemePref(): Promise<ThemePreference> {
  const raw = await SecureStore.getItemAsync(THEME_KEY);
  if (raw && isThemePreference(raw)) return raw;
  return 'system';
}

export async function setThemePref(value: ThemePreference): Promise<void> {
  await SecureStore.setItemAsync(THEME_KEY, value);
}

export async function getHapticsPref(): Promise<boolean> {
  const raw = await SecureStore.getItemAsync(HAPTICS_KEY);
  // Default ON when unset.
  return raw !== 'off';
}

export async function setHapticsPref(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(HAPTICS_KEY, enabled ? 'on' : 'off');
}
