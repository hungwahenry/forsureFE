import * as React from 'react';
import { Pressable, View } from 'react-native';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJoinCall } from '@/features/calls/api/joinCall';
import { CallRoom } from '@/features/calls/components/CallRoom';
import { Text } from '@/components/ui/text';
import { requestCallPermissions } from '@/lib/permissions/call';

export default function CallScreen() {
  const router = useRouter();
  const { id: activityId } = useLocalSearchParams<{ id: string }>();
  const join = useJoinCall(activityId);
  const [permissionDenied, setPermissionDenied] = React.useState(false);

  React.useEffect(() => {
    requestCallPermissions().then((granted) => {
      if (granted) {
        join.mutate();
      } else {
        setPermissionDenied(true);
      }
    });
  }, []);

  return (
    <View className="flex-1 bg-black">
      {permissionDenied && (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text className="text-center text-white">
            Camera and microphone access is required to join a call.
          </Text>
          <Pressable onPress={() => router.back()} className="rounded-full bg-white/20 px-6 py-3">
            <Text className="text-white">Go Back</Text>
          </Pressable>
        </View>
      )}

      {!permissionDenied && join.isPending && (
        <View className="flex-1 items-center justify-center gap-3">
          <LoadingIndicator size={10} color="white" />
          <Text className="text-white">Joining call…</Text>
        </View>
      )}

      {!permissionDenied && join.isError && (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text className="text-center text-white">
            Could not join the call. Please try again.
          </Text>
          <Pressable
            onPress={() => join.mutate()}
            className="rounded-full bg-white/20 px-6 py-3"
          >
            <Text className="text-white">Retry</Text>
          </Pressable>
        </View>
      )}

      {!permissionDenied && join.isSuccess && (
        <CallRoom
          token={join.data.token}
          roomId={join.data.roomId}
          username={join.data.username}
          onLeave={() => router.back()}
        />
      )}
    </View>
  );
}
