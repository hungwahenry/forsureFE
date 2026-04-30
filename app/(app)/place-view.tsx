import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { PlaceMapView } from '@/features/places/components/PlaceMapView';
import { openInMaps } from '@/features/places/utils/openInMaps';
import { useDeviceLocation } from '@/lib/hooks/useDeviceLocation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CloseCircle, RouteSquare } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

interface PlaceViewParams {
  name: string;
  lat: string;
  lng: string;
}

export default function PlaceViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<PlaceViewParams>();
  const { location } = useDeviceLocation({ autoFetchIfGranted: true });

  const lat = Number(params.lat);
  const lng = Number(params.lng);
  const name = params.name ?? '';
  const valid = Number.isFinite(lat) && Number.isFinite(lng);

  return (
    <Screen edges={['top', 'bottom']} noKeyboardAvoidance>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={CloseCircle} className="text-muted-foreground size-7" />
        </Pressable>
        <Text
          className="text-foreground flex-1 text-center text-base font-semibold"
          numberOfLines={1}
        >
          {name}
        </Text>
        <View className="size-7" />
      </View>

      <View className="flex-1">
        {valid ? (
          <PlaceMapView
            destination={{ lat, lng }}
            viewer={location ? { lat: location.lat, lng: location.lng } : null}
          />
        ) : null}
      </View>

      <View className="px-6 pb-2 pt-4">
        <Button
          size="lg"
          onPress={() => valid && void openInMaps({ lat, lng })}
          disabled={!valid}
          leftIcon={
            <Icon
              as={RouteSquare}
              className="text-primary-foreground size-5"
            />
          }
        >
          <Text>open in maps</Text>
        </Button>
      </View>
    </Screen>
  );
}
