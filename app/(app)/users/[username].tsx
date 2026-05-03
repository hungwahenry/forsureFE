import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useUserProfile } from '@/features/users/api/getUserProfile';
import { useUserActivities } from '@/features/users/api/listUserActivities';
import { useUserPosts } from '@/features/users/api/listUserPosts';
import { ProfileHeader } from '@/features/users/components/ProfileHeader';
import { ProfileStats } from '@/features/users/components/ProfileStats';
import { ProfileTabs } from '@/features/users/components/ProfileTabs';
import { UserActivityRow } from '@/features/users/components/UserActivityRow';
import { UserPostCard } from '@/features/users/components/UserPostCard';
import {
  isMyProfile,
  type UserActivity,
  type UserPost,
} from '@/features/users/types';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Camera, Flag, More } from 'iconsax-react-nativejs';
import * as React from 'react';
import { FlatList, Pressable, View } from 'react-native';

type Tab = 'memories' | 'activities';

export default function UserProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ username: string }>();
  const username = params.username ?? '';

  const profile = useUserProfile(username);
  const posts = useUserPosts(username);
  const activities = useUserActivities(username);
  const [tab, setTab] = React.useState<Tab>('memories');

  if (profile.data && isMyProfile(profile.data)) {
    return <Redirect href="/profile" />;
  }

  const goReport = () =>
    router.push({
      pathname: '/report',
      params: { targetType: 'USER', targetId: profile.data?.id ?? '' },
    });

  const renderHeader = () => {
    if (!profile.data) return null;
    const target = profile.data;
    const stats = isMyProfile(target)
      ? [
          { value: target.stats.activitiesHosted, label: 'hosted' },
          { value: target.stats.activitiesJoined, label: 'joined' },
          { value: target.stats.activitiesCompleted, label: 'attended' },
          { value: target.stats.memoriesShared, label: 'memories' },
        ]
      : [
          { value: target.stats.activitiesHosted, label: 'hosted' },
          { value: target.stats.activitiesCompleted, label: 'attended' },
          { value: target.stats.memoriesShared, label: 'memories' },
        ];
    return (
      <>
        <ProfileHeader
          profile={target}
          actionsSlot={
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <Pressable hitSlop={8}>
                  <Icon as={More} className="text-muted-foreground size-6" />
                </Pressable>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onPress={goReport}>
                  <Icon as={Flag} className="size-4" />
                  <Text>report</Text>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          }
        />
        <ProfileStats stats={stats} />
        <ProfileTabs<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'memories', label: 'memories' },
            { value: 'activities', label: 'hosted' },
          ]}
        />
      </>
    );
  };

  if (profile.isPending) {
    return (
      <Screen edges={['top']}>
        <Header onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      </Screen>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <Screen edges={['top']}>
        <Header onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-center">
            couldn't load this profile.
          </Text>
        </View>
      </Screen>
    );
  }

  const postItems: UserPost[] =
    posts.data?.pages.flatMap((p) => p.items) ?? [];
  const activityItems: UserActivity[] =
    activities.data?.pages.flatMap((p) => p.items) ?? [];

  const onEndReached = () => {
    if (tab === 'memories' && posts.hasNextPage && !posts.isFetchingNextPage) {
      void posts.fetchNextPage();
    } else if (
      tab === 'activities' &&
      activities.hasNextPage &&
      !activities.isFetchingNextPage
    ) {
      void activities.fetchNextPage();
    }
  };

  const isFetchingNext =
    tab === 'memories' ? posts.isFetchingNextPage : activities.isFetchingNextPage;
  const isPendingTab =
    tab === 'memories' ? posts.isPending : activities.isPending;
  const items: (UserPost | UserActivity)[] =
    tab === 'memories' ? postItems : activityItems;

  return (
    <Screen edges={['top']}>
      <Header onBack={() => router.back()} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          tab === 'memories' ? (
            <UserPostCard post={item as UserPost} />
          ) : (
            <UserActivityRow activity={item as UserActivity} />
          )
        }
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={
          isPendingTab ? (
            <View className="items-center py-10">
              <LoadingIndicator size={8} />
            </View>
          ) : tab === 'memories' ? (
            <EmptyState
              icon={Camera}
              title="no memories shared yet"
              subtitle="public memories from this person's activities will land here."
            />
          ) : (
            <EmptyState
              icon={Calendar}
              title="nothing hosted yet"
              subtitle="past activities they hosted will show up here."
            />
          )
        }
        ListFooterComponent={
          isFetchingNext ? (
            <View className="items-center py-6">
              <LoadingIndicator size={8} />
            </View>
          ) : null
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </Screen>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <Pressable onPress={onBack} hitSlop={8}>
        <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
      </Pressable>
      <View className="size-7" />
    </View>
  );
}
