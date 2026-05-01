import { useLeaveActivity } from '@/features/activities/join/api/joinActivity';
import type { ActivityParticipant } from '@/features/activities/types';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useCancelActivity } from '../api/cancelActivity';
import { useKickMember } from '../api/kickMember';

export type PendingAction =
  | { kind: 'cancel' }
  | { kind: 'leave' }
  | { kind: 'kick'; target: ActivityParticipant };

const DIALOG_CONFIG = {
  cancel: {
    title: 'cancel this activity?',
    body: "everyone in the chat will be told. this can't be undone.",
    confirm: 'cancel activity',
  },
  leave: {
    title: 'leave this activity?',
    body: "you'll lose access to the chat.",
    confirm: 'leave',
  },
} as const;

export function useActivityAction(activityId: string) {
  const router = useRouter();
  const cancelMutation = useCancelActivity();
  const kickMutation = useKickMember();
  const leaveMutation = useLeaveActivity();
  const [pending, setPending] = React.useState<PendingAction | null>(null);

  const onConfirm = async () => {
    if (!pending) return;
    const current = pending;
    setPending(null);
    try {
      if (current.kind === 'cancel') {
        await cancelMutation.mutateAsync(activityId);
        toast.success('activity cancelled');
      } else if (current.kind === 'leave') {
        await leaveMutation.mutateAsync(activityId);
        toast.success('left activity');
        router.back();
      } else {
        await kickMutation.mutateAsync({ activityId, userId: current.target.userId });
        toast.success(`removed @${current.target.username}`);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "couldn't complete that.";
      toast.error(message);
    }
  };

  const dialogText = pending
    ? pending.kind === 'cancel'
      ? DIALOG_CONFIG.cancel
      : pending.kind === 'leave'
        ? DIALOG_CONFIG.leave
        : {
            title: `remove @${pending.target.username}?`,
            body: "they'll be removed from the chat immediately.",
            confirm: 'remove',
          }
    : null;

  return {
    pending,
    setPending,
    onConfirm,
    dialogText,
    leavePending: leaveMutation.isPending,
  };
}
