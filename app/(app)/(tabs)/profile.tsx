import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useMyProfile } from '@/features/users/api/getMyProfile';
import { useUserActivities } from '@/features/users/api/listUserActivities';
import { useUserPosts } from '@/features/users/api/listUserPosts';
import { ProfileHeader } from '@/features/users/components/ProfileHeader';
import { ProfileStats } from '@/features/users/components/ProfileStats';
import { ProfileTabs } from '@/features/users/components/ProfileTabs';
import { UserActivityRow } from '@/features/users/components/UserActivityRow';
import { UserPostCard } from '@/features/users/components/UserPostCard';
import type { UserActivity, UserPost } from '@/features/users/types';
import { toast } from '@/lib/toast';
import {
  Calendar,
  Camera,
  Edit2,
  Logout,
  Setting2,
} from 'iconsax-react-nativejs';
import * as React from 'react';
import { FlatList, Pressable, View } from 'react-native';

type Tab = 'memories' | 'activities';

export default function ProfileScreen() {
  const profile = useMyProfile();
  const username = profile.data?.username ?? '';
  const enabled = !!username;
  const posts = useUserPosts(username, enabled);
  const activities = useUserActivities(username, enabled);
  const { signOut, isPending: signingOut } = useSignOut();
  const [tab, setTab] = React.useState<Tab>('memories');

  if (profile.isPending || !profile.data) {
    return (
      <Screen edges={['top']} noKeyboardAvoidance>
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      </Screen>
    );
  }

  const me = profile.data;
  const stats = [
    { value: me.stats.activitiesHosted, label: 'hosted' },
    { value: me.stats.activitiesJoined, label: 'joined' },
    { value: me.stats.activitiesCompleted, label: 'attended' },
    { value: me.stats.memoriesShared, label: 'memories' },
  ];

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
    <Screen edges={['top']} noKeyboardAvoidance>
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
        ListHeaderComponent={
          <>
            <ProfileHeader
              profile={me}
              actionsSlot={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Pressable hitSlop={8}>
                      <Icon
                        as={Setting2}
                        className="text-muted-foreground size-6"
                      />
                    </Pressable>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onPress={() => toast('coming soon')}>
                      <Icon as={Edit2} className="size-4" />
                      <Text>edit profile</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onPress={() => void signOut()}
                      disabled={signingOut}
                    >
                      <Icon as={Logout} className="size-4" />
                      <Text>sign out</Text>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
            <ProfileStats stats={stats} />
            <ProfileTabs<Tab>
              value={tab}
              onChange={setTab}
              options={[
                { value: 'memories', label: 'memories' },
                { value: 'activities', label: 'activities' },
              ]}
            />
          </>
        }
        ListEmptyComponent={
          isPendingTab ? (
            <View className="items-center py-10">
              <LoadingIndicator size={8} />
            </View>
          ) : tab === 'memories' ? (
            <EmptyState
              icon={Camera}
              title="no memories yet"
              subtitle="share photos from your activities to see them here."
            />
          ) : (
            <EmptyState
              icon={Calendar}
              title="no past activities yet"
              subtitle="things you host or join will land here once they're done."
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
