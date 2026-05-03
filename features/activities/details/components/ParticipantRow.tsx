import { Text } from '@/components/ui/text';
import { useOpenUserProfile } from '@/features/users/hooks/useOpenUserProfile';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import type { ActivityParticipant } from '../../types';

interface ParticipantRowProps {
  participant: ActivityParticipant;
  isHost: boolean;
  canKick: boolean;
  onKick?: () => void;
}

export function ParticipantRow({
  participant,
  isHost,
  canKick,
  onKick,
}: ParticipantRowProps) {
  const openUserProfile = useOpenUserProfile();
  return (
    <View className="flex-row items-center gap-3 px-6 py-3">
      <Pressable
        onPress={() => openUserProfile(participant.username)}
        hitSlop={6}
        className="flex-1 flex-row items-center gap-3"
      >
        <Image
          source={{ uri: participant.avatarUrl }}
          className="bg-muted"
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
        <View className="flex-1">
          <Text
            className="text-foreground text-base font-semibold"
            numberOfLines={1}
          >
            {participant.displayName}
          </Text>
          <Text className="text-muted-foreground text-sm" numberOfLines={1}>
            @{participant.username}
          </Text>
        </View>
      </Pressable>
      {isHost ? (
        <View className="bg-primary/10 rounded-full px-2 py-0.5">
          <Text className="text-primary text-xs font-semibold">host</Text>
        </View>
      ) : null}
      {canKick && onKick ? (
        <Pressable onPress={onKick} hitSlop={6}>
          <Text className="text-destructive text-sm font-semibold">
            remove
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
