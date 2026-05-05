import { AvatarStack } from '@/components/ui/avatar-stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ActivityHeader } from '@/features/activities/components/ActivityHeader';
import { useActivityPreview } from '@/features/activities/preview/api/getPreview';
import { usePreviewActions } from '@/features/activities/preview/hooks/usePreviewActions';
import { PlaceMapView } from '@/features/places/components/PlaceMapView';
import { useDeviceLocation } from '@/lib/hooks/useDeviceLocation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

const STACK_AVATAR_SIZE = 28;
const STACK_OVERLAP = 10;
const MAP_HEIGHT = 360;

export default function ActivityScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const preview = useActivityPreview(id);
  const data = preview.data ?? null;
  const flow = usePreviewActions(id, data);
  const { location } = useDeviceLocation({ autoFetchIfGranted: true });

  const goingAvatars = data
    ? [data.host.avatarUrl, ...data.participantAvatarUrls.slice(0, 2)]
    : [];
  const overflow = data
    ? Math.max(0, data.participantCount - goingAvatars.length)
    : 0;

  return (
    <Screen edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          activity
        </Text>
        <View className="size-7" />
      </View>

      {preview.isPending ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : !data ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-center">
            this activity isn't available.
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <View
            className="bg-muted overflow-hidden"
            style={{ height: MAP_HEIGHT }}
          >
            <PlaceMapView
              destination={{ lat: data.place.lat, lng: data.place.lng }}
              viewer={location ? { lat: location.lat, lng: location.lng } : null}
            />
          </View>

          <ActivityHeader details={data} />

          <View className="px-6">
            <View className="flex-row items-center gap-3">
              <AvatarStack
                uris={goingAvatars}
                size={STACK_AVATAR_SIZE}
                overlap={STACK_OVERLAP}
                overflow={overflow}
              />
              <Text className="text-muted-foreground text-sm">
                {data.participantCount} going
              </Text>
            </View>
          </View>

          {flow.cta ? (
            <View className="mt-auto px-6 pb-6">
              <Button
                onPress={flow.cta.onPress}
                disabled={flow.cta.disabled || flow.isJoining}
                variant={flow.cta.variant}
                size="lg"
              >
                {flow.isJoining ? (
                  <LoadingIndicator color="white" />
                ) : (
                  <Text>{flow.cta.label}</Text>
                )}
              </Button>
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
}
