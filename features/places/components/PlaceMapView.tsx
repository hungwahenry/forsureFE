import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import MapView, { Marker, type Region } from 'react-native-maps';
import { StyleSheet } from 'react-native';

interface Coords {
  lat: number;
  lng: number;
}

interface PlaceMapViewProps {
  destination: Coords;
  /** Viewer's current location, if available. */
  viewer: Coords | null;
}

export function PlaceMapView({ destination, viewer }: PlaceMapViewProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const ref = React.useRef<MapView>(null);

  const initialRegion: Region = React.useMemo(
    () => regionFor(destination, viewer),
    [destination, viewer],
  );

  // When viewer location resolves *after* the map has mounted (permission
  // prompt, GPS fix), re-fit so both pins are visible.
  React.useEffect(() => {
    if (!viewer) return;
    ref.current?.fitToCoordinates(
      [
        { latitude: destination.lat, longitude: destination.lng },
        { latitude: viewer.lat, longitude: viewer.lng },
      ],
      {
        edgePadding: { top: 80, right: 60, bottom: 200, left: 60 },
        animated: true,
      },
    );
  }, [viewer, destination]);

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      initialRegion={initialRegion}
      showsUserLocation={!!viewer}
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
    >
      <Marker
        coordinate={{ latitude: destination.lat, longitude: destination.lng }}
        pinColor={colors.primary}
      />
    </MapView>
  );
}

function regionFor(destination: Coords, viewer: Coords | null): Region {
  if (!viewer) {
    return {
      latitude: destination.lat,
      longitude: destination.lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }
  const midLat = (destination.lat + viewer.lat) / 2;
  const midLng = (destination.lng + viewer.lng) / 2;
  const latDelta = Math.abs(destination.lat - viewer.lat) * 1.6 + 0.02;
  const lngDelta = Math.abs(destination.lng - viewer.lng) * 1.6 + 0.02;
  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}
