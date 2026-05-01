import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import type { ActivityDetails, ActivityParticipant } from '../../types';
import { ParticipantRow } from './ParticipantRow';

interface ParticipantsListProps {
  details: ActivityDetails;
  viewerIsHost: boolean;
  onKick: (participant: ActivityParticipant) => void;
}

export function ParticipantsList({
  details,
  viewerIsHost,
  onKick,
}: ParticipantsListProps) {
  return (
    <View>
      <Text className="text-muted-foreground px-6 pb-1 pt-4 text-xs font-semibold uppercase">
        going · {details.participantCount}
      </Text>
      <ParticipantRow
        participant={details.host}
        isHost
        canKick={false}
      />
      {details.members.map((m) => (
        <ParticipantRow
          key={m.userId}
          participant={m}
          isHost={false}
          canKick={viewerIsHost}
          onKick={() => onKick(m)}
        />
      ))}
    </View>
  );
}
