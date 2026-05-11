import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { HMSVideoViewMode } from '@100mslive/react-native-hms';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  CallSlash,
  Microphone,
  MicrophoneSlash,
  Video,
  VideoSlash,
} from 'iconsax-react-nativejs';
import {
  useCallRoomController,
  type HmsViewComponent,
  type PeerTrackNode,
} from '../hooks/useCallRoomController';

interface Props {
  token: string;
  roomId: string;
  username: string;
  onLeave: () => void;
}

export function CallRoom({ token, username, onLeave }: Props) {
  const c = useCallRoomController({ token, username, onLeave });

  return (
    <View className="flex-1 bg-black pb-8 pt-16">
      {/* Reconnecting banner */}
      {c.reconnecting && (
        <View className="absolute left-0 right-0 top-28 z-10 items-center">
          <View className="flex-row items-center gap-2 rounded-full bg-yellow-500/90 px-4 py-2">
            <LoadingIndicator size={6} color="white" />
            <Text className="text-sm font-medium text-white">Reconnecting…</Text>
          </View>
        </View>
      )}

      {/* HMS join-in-progress overlay */}
      {c.isJoining ? (
        <View className="flex-1 items-center justify-center gap-3">
          <LoadingIndicator size={10} color="white" />
          <Text className="text-white/60">Connecting to call…</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerClassName="flex-row flex-wrap justify-center gap-3 px-3"
            className="flex-1"
          >
            {c.nodes.map((node) => (
              <PeerTile key={node.id} node={node} HmsView={c.HmsView} />
            ))}
            {c.nodes.length === 0 && (
              <View className="flex-1 items-center justify-center">
                <Text className="text-white/50">Waiting for others to join…</Text>
              </View>
            )}
          </ScrollView>

          <View className="flex-row items-center justify-center gap-6 px-8">
            <ControlButton onPress={c.toggleMute} active={c.isMuted}>
              <Icon
                as={c.isMuted ? MicrophoneSlash : Microphone}
                className="size-6 text-white"
              />
            </ControlButton>
            <ControlButton onPress={c.toggleVideo} active={c.isVideoOff}>
              <Icon
                as={c.isVideoOff ? VideoSlash : Video}
                className="size-6 text-white"
              />
            </ControlButton>
            <ControlButton onPress={c.leave} destructive>
              <Icon as={CallSlash} className="size-6 text-white" />
            </ControlButton>
          </View>
        </>
      )}
    </View>
  );
}

function PeerTile({
  node,
  HmsView,
}: {
  node: PeerTrackNode;
  HmsView: HmsViewComponent | null;
}) {
  const { peer, track } = node;
  const videoVisible = HmsView && track?.trackId && !track.isMute();

  return (
    <View className="h-44 w-44 items-center justify-center overflow-hidden rounded-2xl bg-white/10">
      {videoVisible ? (
        <HmsView
          trackId={track!.trackId}
          mirror={peer.isLocal}
          scaleType={HMSVideoViewMode.ASPECT_FILL}
          id={`hms-${node.id}`}
          style={{ flex: 1, width: '100%' }}
        />
      ) : (
        <View className="flex-1 items-center justify-center gap-2">
          <View className="size-14 items-center justify-center rounded-full bg-white/20">
            <Text className="text-2xl">
              {peer.name?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text className="text-sm text-white/70" numberOfLines={1}>
            {peer.name}
          </Text>
        </View>
      )}
    </View>
  );
}

function ControlButton({
  children,
  onPress,
  active,
  destructive,
}: {
  children: React.ReactNode;
  onPress: () => void;
  active?: boolean;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`size-14 items-center justify-center rounded-full ${
        destructive ? 'bg-red-500' : active ? 'bg-white/30' : 'bg-white/15'
      }`}
    >
      {children}
    </Pressable>
  );
}
