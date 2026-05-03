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
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useDeleteActivityPost } from '@/features/posts/api/deletePost';
import { PostCard } from '@/features/posts/components/PostCard';
import { ApiError } from '@/lib/api/types';
import { usePullRefresh } from '@/lib/hooks/usePullRefresh';
import { toast } from '@/lib/toast';
import { useFocusEffect, useRouter } from 'expo-router';
import { Discover } from 'iconsax-react-nativejs';
import * as React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useExplorePosts } from '../api/listExplorePosts';
import type { ExplorePost } from '../types';

interface ExploreListProps {
  lat: number;
  lng: number;
}

export function ExploreList({ lat, lng }: ExploreListProps) {
  const router = useRouter();
  const viewerUserId = useAuthStore((s) => s.user?.id ?? '');
  const explore = useExplorePosts({ lat, lng });
  const deleteMutation = useDeleteActivityPost();
  const refresh = usePullRefresh(explore.refetch);
  const [pendingDelete, setPendingDelete] = React.useState<ExplorePost | null>(
    null,
  );

  const items: ExplorePost[] = React.useMemo(
    () => explore.data?.pages.flatMap((p) => p.items) ?? [],
    [explore.data],
  );

  useFocusEffect(
    React.useCallback(() => {
      void explore.refetch();
    }, [explore.refetch]),
  );

  const onEndReached = () => {
    if (explore.hasNextPage && !explore.isFetchingNextPage) {
      void explore.fetchNextPage();
    }
  };

  const goToCompose = (activityId: string) =>
    router.push({ pathname: '/post', params: { activityId } });

  const goToReport = (postId: string) =>
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
        activityId: target.activity.id,
        postId: target.id,
      });
      toast.success('post deleted.');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't delete. try again.";
      toast.error(message);
    }
  };

  if (explore.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingIndicator size={10} />
      </View>
    );
  }

  if (items.length === 0 && !explore.isFetching) {
    return (
      <EmptyState
        icon={Discover}
        title="nothing to explore yet"
        subtitle="when people share memories from public hangouts nearby, they'll show up here."
      />
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <PostCard
            post={{
              id: item.id,
              activityId: item.activity.id,
              caption: item.caption,
              visibility: 'PUBLIC',
              createdAt: item.createdAt,
              updatedAt: item.createdAt,
              author: item.author,
              photos: item.photos,
            }}
            viewerIsAuthor={item.author.id === viewerUserId}
            viewerIsHost={false}
            activityContext={{
              emoji: item.activity.emoji,
              title: item.activity.title,
              hostUsername: item.activity.hostUsername,
              participantCount: item.activity.participantCount,
              participantAvatarUrls: item.activity.participantAvatarUrls,
            }}
            onEdit={() => goToCompose(item.activity.id)}
            onDelete={() => setPendingDelete(item)}
            onReport={() => goToReport(item.id)}
          />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl {...refresh} />}
        ListFooterComponent={
          explore.isFetchingNextPage ? (
            <View className="items-center py-6">
              <LoadingIndicator size={8} />
            </View>
          ) : null
        }
      />

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
