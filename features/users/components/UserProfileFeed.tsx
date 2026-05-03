import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Calendar, Camera } from 'iconsax-react-nativejs';
import * as React from 'react';
import { FlatList, View } from 'react-native';
import { useUserActivities } from '../api/listUserActivities';
import { useUserPosts } from '../api/listUserPosts';
import {
  isMyProfile,
  type UserActivity,
  type UserPost,
  type UserProfile,
} from '../types';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats, getProfileStats } from './ProfileStats';
import { ProfileTabs } from './ProfileTabs';
import { UserActivityRow } from './UserActivityRow';
import { UserPostCard } from './UserPostCard';

type Tab = 'memories' | 'activities';

interface UserProfileFeedProps {
  profile: UserProfile;
}

export function UserProfileFeed({ profile }: UserProfileFeedProps) {
  const isSelf = isMyProfile(profile);
  const username = profile.username;
  const posts = useUserPosts(username);
  const activities = useUserActivities(username);
  const [tab, setTab] = React.useState<Tab>('memories');

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
          <ProfileHeader profile={profile} />
          <ProfileStats stats={getProfileStats(profile)} />
          <ProfileTabs<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'memories', label: 'memories' },
              {
                value: 'activities',
                label: isSelf ? 'activities' : 'hosted',
              },
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
            title={isSelf ? 'no memories yet' : 'no memories shared yet'}
            subtitle={
              isSelf
                ? 'share photos from your activities to see them here.'
                : "public memories from this person's activities will land here."
            }
          />
        ) : (
          <EmptyState
            icon={Calendar}
            title={isSelf ? 'no past activities yet' : 'nothing hosted yet'}
            subtitle={
              isSelf
                ? "things you host or join will land here once they're done."
                : 'past activities they hosted will show up here.'
            }
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
  );
}
