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
import { ActivityHeader } from '@/features/activities/components/ActivityHeader';
import { HostActions } from '@/features/activities/details/components/HostActions';
import { LeaveButton } from '@/features/activities/details/components/LeaveButton';
import { ParticipantsList } from '@/features/activities/details/components/ParticipantsList';
import { ReportActivityButton } from '@/features/activities/details/components/ReportActivityButton';
import { MemoriesSection } from '@/features/memories/components/MemoriesSection';
import { useActivityAction } from '@/features/activities/manage/hooks/useActivityAction';
import { ShareButton } from '@/features/activities/share/components/ShareButton';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function ChatDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const activityId = params.id;
  const viewerUserId = useAuthStore((s) => s.user?.id ?? '');
  const details = useActivityDetails(activityId, !!viewerUserId);
  const { pending, setPending, onConfirm, dialogText, leavePending } =
    useActivityAction(activityId);

  const data = details.data ?? null;
  const viewerIsHost = !!data && data.host.userId === viewerUserId;


  return (
    <Screen edges={['top', 'bottom']} noKeyboardAvoidance>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground flex-1 text-center text-base font-semibold">
          details
        </Text>
        <ShareButton source={data} />
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
              activityId={activityId}
              status={data.status}
              memoriesShareablePublicly={data.memoriesShareablePublicly}
              onEdit={() => router.push(`/edit-activity?activityId=${activityId}` as never)}
              onCancel={() => setPending({ kind: 'cancel' })}
            />
          ) : (
            <LeaveButton
              onLeave={() => setPending({ kind: 'leave' })}
              disabled={leavePending}
            />
          )}
          {data.status === 'DONE' ? (
            <MemoriesSection
              activity={data}
              viewerUserId={viewerUserId}
              viewerIsHost={viewerIsHost}
            />
          ) : null}
          {!viewerIsHost ? (
            <ReportActivityButton activityId={activityId} />
          ) : null}
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
