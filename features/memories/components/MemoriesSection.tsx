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
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { useRouter } from 'expo-router';
import { Camera } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import type { ActivityDetails } from '@/features/activities/types';
import { useDeleteActivityPost } from '@/features/posts/api/deletePost';
import { useActivityPosts } from '@/features/posts/api/listPosts';
import { PostCard } from '@/features/posts/components/PostCard';
import type { ActivityPost } from '@/features/posts/types';

interface MemoriesSectionProps {
  activity: ActivityDetails;
  viewerUserId: string;
  viewerIsHost: boolean;
}

export function MemoriesSection({
  activity,
  viewerUserId,
  viewerIsHost,
}: MemoriesSectionProps) {
  const router = useRouter();
  const activityId = activity.id;
  const posts = useActivityPosts(activityId);
  const deleteMutation = useDeleteActivityPost();
  const [pendingDelete, setPendingDelete] = React.useState<ActivityPost | null>(
    null,
  );

  const items = posts.data ?? [];
  const viewerHasPosted = items.some((p) => p.author.id === viewerUserId);

  const goCompose = () =>
    router.push({ pathname: '/post', params: { activityId } });

  const goReport = (postId: string) =>
    router.push({
      pathname: '/report',
      params: { targetType: 'POST', targetId: postId },
    });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteMutation.mutateAsync({
        activityId,
        postId: target.id,
      });
      toast.success('post deleted.');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't delete. try again.";
      toast.error(message);
    }
  };

  return (
    <View className="pt-2">
      <Text className="text-muted-foreground px-6 pb-2 text-xs font-semibold uppercase">
        memories
      </Text>

      {posts.isPending ? (
        <View className="items-center py-6">
          <LoadingIndicator size={6} />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="no memories yet"
          subtitle="be the first to share a photo from this hangout."
          actions={
            <Button onPress={goCompose}>
              <Icon as={Camera} className="size-4" />
              <Text>share your memory</Text>
            </Button>
          }
        />
      ) : (
        <>
          {!viewerHasPosted ? (
            <Pressable
              onPress={goCompose}
              className="border-border/40 active:bg-muted/30 mx-6 mb-2 flex-row items-center gap-3 rounded-md border border-dashed px-4 py-4"
            >
              <Icon as={Camera} className="text-foreground size-5" />
              <Text className="text-foreground text-sm">
                share your memory of this hangout
              </Text>
            </Pressable>
          ) : null}
          {items.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              viewerIsAuthor={p.author.id === viewerUserId}
              viewerIsHost={viewerIsHost}
              activityContext={{
                emoji: activity.emoji,
                title: activity.title,
                hostUsername: activity.host.username,
              }}
              onEdit={goCompose}
              onDelete={() => setPendingDelete(p)}
              onReport={() => goReport(p.id)}
            />
          ))}
        </>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              this can't be undone. the photos go with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>nevermind</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={() => void confirmDelete()}>
              <Text>delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
