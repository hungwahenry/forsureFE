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
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useEditActivity } from '@/features/activities/manage/api/editActivity';
import { useActivityPosts } from '@/features/posts/api/listPosts';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import * as React from 'react';
import { View } from 'react-native';

interface MemoriesShareToggleProps {
  activityId: string;
  value: boolean;
}

export function MemoriesShareToggle({
  activityId,
  value,
}: MemoriesShareToggleProps) {
  const editActivity = useEditActivity();
  const posts = useActivityPosts(activityId, value);
  const [pendingTurnOff, setPendingTurnOff] = React.useState(false);

  const publicPostCount = (posts.data ?? []).filter(
    (p) => p.visibility === 'PUBLIC',
  ).length;

  const flipTo = async (next: boolean) => {
    try {
      await editActivity.mutateAsync({
        activityId,
        patch: { memoriesShareablePublicly: next },
      });
      toast.success(
        next
          ? 'memories can now appear on Explore.'
          : 'memories are now group-only.',
      );
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't update. try again.";
      toast.error(message);
    }
  };

  const onToggle = (next: boolean) => {
    if (!next && publicPostCount > 0) {
      setPendingTurnOff(true);
      return;
    }
    void flipTo(next);
  };

  const confirmTurnOff = async () => {
    setPendingTurnOff(false);
    await flipTo(false);
  };

  return (
    <View className="border-border/40 flex-row items-start justify-between gap-4 rounded-md border p-3">
      <View className="flex-1">
        <Text className="text-foreground text-sm">share memories publicly</Text>
        <Text className="text-muted-foreground text-xs">
          when on, memories from this hangout can appear on Explore.
        </Text>
      </View>
      <View className="pt-0.5">
        <Switch
          checked={value}
          onCheckedChange={onToggle}
          disabled={editActivity.isPending}
        />
      </View>

      <AlertDialog
        open={pendingTurnOff}
        onOpenChange={(open) => {
          if (!open) setPendingTurnOff(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>turn off public sharing?</AlertDialogTitle>
            <AlertDialogDescription>
              {publicPostCount === 1
                ? '1 public post will become group-only.'
                : `${publicPostCount} public posts will become group-only.`}{' '}
              they'll be removed from Explore right away.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>nevermind</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={() => void confirmTurnOff()}>
              <Text>turn off</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
