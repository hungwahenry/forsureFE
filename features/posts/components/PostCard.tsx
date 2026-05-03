import { AvatarStack } from '@/components/ui/avatar-stack';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ActivityLine } from '@/features/activities/components/ActivityLine';
import { useOpenUserProfile } from '@/features/users/hooks/useOpenUserProfile';
import { formatChatDate } from '@/lib/format';
import { Image } from 'expo-image';
import {
  Edit2,
  Flag,
  Global,
  More,
  People,
  Trash,
} from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';
import type { ActivityPost } from '../types';
import { PostPhotoCarousel } from './PostPhotoCarousel';

export interface PostActivityContext {
  emoji: string;
  title: string;
  hostUsername: string;
  participantCount: number;
  participantAvatarUrls?: string[];
}

interface PostCardProps {
  post: ActivityPost;
  viewerIsAuthor: boolean;
  viewerIsHost: boolean;
  activityContext: PostActivityContext;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

export function PostCard({
  post,
  viewerIsAuthor,
  viewerIsHost,
  activityContext,
  onEdit,
  onDelete,
  onReport,
}: PostCardProps) {
  const openUserProfile = useOpenUserProfile();
  const canDelete = viewerIsAuthor || viewerIsHost;
  const authorIsHost =
    post.author.username === activityContext.hostUsername;
  const stackAvatars = activityContext.participantAvatarUrls ?? [];
  const showStack = stackAvatars.length > 0;
  const stackOverflow = showStack
    ? Math.max(0, activityContext.participantCount - stackAvatars.length)
    : 0;
  return (
    <View className="border-border/40 border-b py-4">
      <View className="mb-3 flex-row items-start justify-between gap-3 px-6">
        <View className="flex-1 flex-row items-start gap-2">
          <Pressable
            onPress={() => openUserProfile(post.author.username)}
            hitSlop={6}
          >
            <Image
              source={{ uri: post.author.avatarUrl }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
              className="bg-muted"
            />
          </Pressable>
          <View className="flex-1">
            <ActivityLine
              activity={{
                emoji: activityContext.emoji,
                title: activityContext.title,
              }}
              hostUsername={activityContext.hostUsername}
              participantCount={
                showStack ? undefined : activityContext.participantCount
              }
            />
            <View className="mt-0.5 flex-row flex-wrap items-center gap-1">
              {!authorIsHost ? (
                <Text className="text-muted-foreground text-xs">
                  shared by{' '}
                  <Text
                    className="text-foreground font-medium"
                    onPress={() => openUserProfile(post.author.username)}
                  >
                    @{post.author.username}
                  </Text>
                  {' · '}
                </Text>
              ) : null}
              <Icon
                as={post.visibility === 'PUBLIC' ? Global : People}
                className="text-muted-foreground size-3"
              />
              <Text className="text-muted-foreground text-xs">
                {post.visibility === 'PUBLIC' ? 'public' : 'group'}
                {' · '}
                {formatChatDate(new Date(post.createdAt))}
              </Text>
            </View>
          </View>
        </View>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Pressable hitSlop={8}>
              <Icon as={More} className="text-muted-foreground size-5" />
            </Pressable>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {viewerIsAuthor ? (
              <DropdownMenuItem onPress={onEdit}>
                <Icon as={Edit2} className="size-4" />
                <Text>edit</Text>
              </DropdownMenuItem>
            ) : null}
            {!viewerIsAuthor ? (
              <DropdownMenuItem onPress={onReport}>
                <Icon as={Flag} className="size-4" />
                <Text>report</Text>
              </DropdownMenuItem>
            ) : null}
            {canDelete ? (
              <DropdownMenuItem variant="destructive" onPress={onDelete}>
                <Icon as={Trash} className="size-4" />
                <Text>delete</Text>
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </View>

      {post.caption ? (
        <Text className="text-foreground mb-3 px-6 text-sm">
          {post.caption}
        </Text>
      ) : null}

      <View className="px-6">
        <PostPhotoCarousel photos={post.photos} />
      </View>

      {showStack ? (
        <View className="mt-3 flex-row items-center gap-2 px-6">
          <AvatarStack uris={stackAvatars} overflow={stackOverflow} />
          <Text className="text-muted-foreground text-xs">
            {activityContext.participantCount} went
          </Text>
        </View>
      ) : null}
    </View>
  );
}
