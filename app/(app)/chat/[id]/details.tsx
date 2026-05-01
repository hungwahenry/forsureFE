import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useActivityDetails } from '@/features/activities/details/api/getDetails';
import { ActivityHeader } from '@/features/activities/details/components/ActivityHeader';
import { HostActions } from '@/features/activities/details/components/HostActions';
import { LeaveButton } from '@/features/activities/details/components/LeaveButton';
import { ParticipantsList } from '@/features/activities/details/components/ParticipantsList';
import { useLeaveActivity } from '@/features/activities/join/api/joinActivity';
import { useCancelActivity } from '@/features/activities/manage/api/cancelActivity';
import { useKickMember } from '@/features/activities/manage/api/kickMember';
import type { ActivityParticipant } from '@/features/activities/types';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type PendingAction =
  | { kind: 'cancel' }
  | { kind: 'leave' }
  | { kind: 'kick'; target: ActivityParticipant };

export default function ChatDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const activityId = params.id;
  const viewerUserId = useAuthStore((s) => s.user?.id ?? '');
  const details = useActivityDetails(activityId, !!viewerUserId);
  const cancelMutation = useCancelActivity();
  const kickMutation = useKickMember();
  const leaveMutation = useLeaveActivity();
  const [pending, setPending] = React.useState<PendingAction | null>(null);

  const data = details.data ?? null;
  const viewerIsHost =
    !!data && data.host.userId === viewerUserId;

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
        await kickMutation.mutateAsync({
          activityId,
          userId: current.target.userId,
        });
        toast.success(`removed @${current.target.username}`);
      }
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't complete that.";
      toast.error(message);
    }
  };

  const dialogText = (() => {
    if (!pending) return null;
    if (pending.kind === 'cancel')
      return {
        title: 'cancel this activity?',
        body: 'everyone in the chat will be told. this can’t be undone.',
        confirm: 'cancel activity',
      };
    if (pending.kind === 'leave')
      return {
        title: 'leave this activity?',
        body: 'you’ll lose access to the chat.',
        confirm: 'leave',
      };
    return {
      title: `remove @${pending.target.username}?`,
      body: 'they’ll be removed from the chat immediately.',
      confirm: 'remove',
    };
  })();

  return (
    <Screen edges={['top', 'bottom']} noKeyboardAvoidance>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground flex-1 text-center text-base font-semibold">
          details
        </Text>
        <View className="size-7" />
      </View>

      {details.isPending ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : !data ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">
            couldn’t load this activity.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <ActivityHeader details={data} />
          <ParticipantsList
            details={data}
            viewerIsHost={viewerIsHost}
            onKick={(target) => setPending({ kind: 'kick', target })}
          />
          {viewerIsHost ? (
            <HostActions
              status={data.status}
              onEdit={() => router.push(`/edit-activity?activityId=${activityId}` as never)}
              onCancel={() => setPending({ kind: 'cancel' })}
            />
          ) : (
            <LeaveButton
              onLeave={() => setPending({ kind: 'leave' })}
              disabled={leaveMutation.isPending}
            />
          )}
        </ScrollView>
      )}

      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        {dialogText ? (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogText.title}</AlertDialogTitle>
              <AlertDialogDescription>{dialogText.body}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>nevermind</Text>
              </AlertDialogCancel>
              <AlertDialogAction onPress={() => void onConfirm()}>
                <Text>{dialogText.confirm}</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : null}
      </AlertDialog>
    </Screen>
  );
}
