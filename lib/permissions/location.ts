import * as Location from 'expo-location';
import { Linking } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface ResolvedLocation {
  lat: number;
  lng: number;
  placeName: string;
}

export async function checkLocationPermission(): Promise<PermissionStatus> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status;
}

export async function requestLocationPermission(): Promise<PermissionStatus> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status;
}

export async function getCurrentLocation(): Promise<ResolvedLocation> {
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const [place] = await Location.reverseGeocodeAsync({
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  });
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    placeName: formatPlaceName(place),
  };
}

function formatPlaceName(
  place: Location.LocationGeocodedAddress | undefined,
): string {
  if (!place) return 'Unknown location';
  const locality = place.city || place.subregion || place.region;
  const parts = [locality, place.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Unknown location';
}

/** Open the OS settings app so a user can grant a previously-denied permission. */
export function openSystemSettings(): Promise<void> {
  return Linking.openSettings();
}
