import * as React from 'react';
import HMSSDK, {
  HMSConfig,
  HMSPeerUpdate,
  HMSTrackType,
  HMSTrackUpdate,
  HMSUpdateListenerActions,
  type HMSPeer,
  type HMSTrack,
  type HMSViewProps,
} from '@100mslive/react-native-hms';

export interface PeerTrackNode {
  id: string;
  peer: HMSPeer;
  track?: HMSTrack;
}

// HmsView is a component property on the HMSSDK instance, not a named export.
export type HmsViewComponent = React.ComponentType<HMSViewProps & { style?: object }>;

const getPTNId = (peer: HMSPeer, track?: HMSTrack) =>
  peer.peerID + (track?.source ?? 'regular');

/**
 * Updates the track+peer of a tile matched by peerID+source.
 * Creates a new tile if createNew=true and no matching tile exists.
 */
const upsertNode = (
  nodes: PeerTrackNode[],
  peer: HMSPeer,
  track: HMSTrack,
  createNew = false,
): PeerTrackNode[] => {
  const id = getPTNId(peer, track);
  const exists = nodes.some((n) => n.id === id);
  if (exists) return nodes.map((n) => (n.id === id ? { ...n, peer, track } : n));
  if (!createNew) return nodes;
  const node: PeerTrackNode = { id, peer, track };
  return peer.isLocal ? [node, ...nodes] : [...nodes, node];
};

/**
 * Updates ONLY the peer reference in every tile for this peerID.
 * Never touches the video track — safe to call on audio mute/peer-metadata events.
 * If createNew=true and no tile exists, creates a new track-less tile.
 */
const updateNodePeer = (
  nodes: PeerTrackNode[],
  peer: HMSPeer,
  createNew = false,
): PeerTrackNode[] => {
  const exists = nodes.some((n) => n.peer.peerID === peer.peerID);
  if (exists) {
    return nodes.map((n) => (n.peer.peerID === peer.peerID ? { ...n, peer } : n));
  }
  if (!createNew) return nodes;
  const node: PeerTrackNode = { id: getPTNId(peer), peer };
  return peer.isLocal ? [node, ...nodes] : [...nodes, node];
};

interface UseCallRoomControllerArgs {
  token: string;
  username: string;
  onLeave: () => void;
}

export interface CallRoomController {
  HmsView: HmsViewComponent | null;
  nodes: PeerTrackNode[];
  isMuted: boolean;
  isVideoOff: boolean;
  isJoining: boolean;
  reconnecting: boolean;
  toggleMute: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  leave: () => Promise<void>;
}

export function useCallRoomController({
  token,
  username,
  onLeave,
}: UseCallRoomControllerArgs): CallRoomController {
  const hmsRef = React.useRef<HMSSDK | null>(null);
  const [HmsView, setHmsView] = React.useState<HmsViewComponent | null>(null);
  const [nodes, setNodes] = React.useState<PeerTrackNode[]>([]);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(true);
  const [reconnecting, setReconnecting] = React.useState(false);

  React.useEffect(() => {
    let hms: HMSSDK;

    async function start() {
      hms = await HMSSDK.build();
      hmsRef.current = hms;
      setHmsView(() => (hms as unknown as { HmsView: HmsViewComponent }).HmsView);

      hms.addEventListener(
        HMSUpdateListenerActions.ON_JOIN,
        (data: { room: { localPeer: HMSPeer } }) => {
          const { localPeer } = data.room;
          setNodes((prev) =>
            localPeer.videoTrack
              ? upsertNode(prev, localPeer, localPeer.videoTrack, true)
              : updateNodePeer(prev, localPeer, true),
          );
          setIsJoining(false);
        },
      );

      hms.addEventListener(
        HMSUpdateListenerActions.ON_PEER_UPDATE,
        ({ peer, type }: { peer: HMSPeer; type: HMSPeerUpdate }) => {
          if (type === HMSPeerUpdate.PEER_LEFT) {
            setNodes((prev) => prev.filter((n) => n.peer.peerID !== peer.peerID));
            return;
          }
          // PEER_JOINED: wait for ON_TRACK_UPDATE (TRACK_ADDED) to create the tile.
          if (type === HMSPeerUpdate.PEER_JOINED) return;
          // All other updates (name change, role change, metadata, etc.):
          // refresh the peer reference in existing tiles without touching the video track.
          setNodes((prev) => updateNodePeer(prev, peer, peer.isLocal));
        },
      );

      hms.addEventListener(
        HMSUpdateListenerActions.ON_TRACK_UPDATE,
        ({ peer, track, type }: { peer: HMSPeer; track: HMSTrack; type: HMSTrackUpdate }) => {
          if (type === HMSTrackUpdate.TRACK_ADDED && track.type === HMSTrackType.VIDEO) {
            setNodes((prev) => upsertNode(prev, peer, track, true));
            return;
          }
          if (type === HMSTrackUpdate.TRACK_MUTED || type === HMSTrackUpdate.TRACK_UNMUTED) {
            if (track.type === HMSTrackType.VIDEO) {
              // Update the tile with the refreshed video track (isMute() reflects new state).
              setNodes((prev) => upsertNode(prev, peer, track));
            } else {
              // Audio mute/unmute: update the peer reference only — never clear the video track.
              setNodes((prev) => updateNodePeer(prev, peer));
            }
          }
        },
      );

      hms.addEventListener(HMSUpdateListenerActions.RECONNECTING, () => {
        setReconnecting(true);
      });

      hms.addEventListener(HMSUpdateListenerActions.RECONNECTED, () => {
        setReconnecting(false);
      });

      hms.addEventListener(HMSUpdateListenerActions.ON_ERROR, (err: unknown) => {
        console.warn('[HMS] error', err);
        setIsJoining(false);
      });

      hms.join(new HMSConfig({ authToken: token, username }));
    }

    start().catch((err) => {
      console.error('[HMS] join failed', err);
      setIsJoining(false);
    });

    return () => {
      const instance = hmsRef.current;
      if (!instance) return;
      instance.removeAllListeners();
      instance
        .leave()
        .then(() => instance.destroy())
        .catch(() => {});
      hmsRef.current = null;
    };
  }, [token, username]);

  const toggleMute = async () => {
    const hms = hmsRef.current;
    if (!hms) return;
    const local = await hms.getLocalPeer();
    local.localAudioTrack()?.setMute(!isMuted);
    setIsMuted((v) => !v);
  };

  const toggleVideo = async () => {
    const hms = hmsRef.current;
    if (!hms) return;
    const local = await hms.getLocalPeer();
    local.localVideoTrack()?.setMute(!isVideoOff);
    setIsVideoOff((v) => !v);
  };

  const leave = async () => {
    const instance = hmsRef.current;
    if (instance) {
      instance.removeAllListeners();
      await instance.leave().catch(() => {});
      await instance.destroy().catch(() => {});
      hmsRef.current = null;
    }
    onLeave();
  };

  return {
    HmsView,
    nodes,
    isMuted,
    isVideoOff,
    isJoining,
    reconnecting,
    toggleMute,
    toggleVideo,
    leave,
  };
}
