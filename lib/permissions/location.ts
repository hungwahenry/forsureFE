import * as Location from 'expo-location';
import { Linking } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface ResolvedLocation {
  lat: number;
  lng: number;
  placeName: string | null;
}

export async function checkLocationPermission(): Promise<PermissionStatus> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status;
}

export async function requestLocationPermission(): Promise<PermissionStatus> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status;
}

const POSITION_MAX_AGE_MS = 5 * 60 * 1000;
const POSITION_TIMEOUT_MS = 25_000;

export async function getCurrentLocation(): Promise<ResolvedLocation> {
  await Location.enableNetworkProviderAsync().catch((err) => {
    console.warn('[location] enableNetworkProviderAsync failed:', err);
  });
  const pos = await getPositionWithFallback();
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    placeName: await resolvePlaceName(
      pos.coords.latitude,
      pos.coords.longitude,
    ),
  };
}

async function getPositionWithFallback(): Promise<Location.LocationObject> {
  const cached = await Location.getLastKnownPositionAsync({
    maxAge: POSITION_MAX_AGE_MS,
  });
  if (cached) return cached;
  return withTimeout(
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
    POSITION_TIMEOUT_MS,
  );
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Location request timed out')), ms),
    ),
  ]);
}

async function resolvePlaceName(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    return formatPlaceName(place);
  } catch {
    return null;
  }
}

function formatPlaceName(
  place: Location.LocationGeocodedAddress | undefined,
): string | null {
  if (!place) return null;
  const locality = place.city || place.subregion || place.region;
  const parts = [locality, place.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

/** Open the OS settings app so a user can grant a previously-denied permission. */
export function openSystemSettings(): Promise<void> {
  return Linking.openSettings();
}
