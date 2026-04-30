import { Linking } from 'react-native';

interface OpenInMapsArgs {
  lat: number;
  lng: number;
}

//Hands off navigation to whichever maps app the user has set as their default
export function openInMaps({ lat, lng }: OpenInMapsArgs): Promise<void> {
  return Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  );
}
