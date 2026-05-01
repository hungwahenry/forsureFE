import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
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

interface PostCardProps {
  post: ActivityPost;
  viewerIsAuthor: boolean;
  viewerIsHost: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

export function PostCard({
  post,
  viewerIsAuthor,
  viewerIsHost,
  onEdit,
  onDelete,
  onReport,
}: PostCardProps) {
  const canDelete = viewerIsAuthor || viewerIsHost;
  return (
    <View className="border-border/40 border-b py-4">
      <View className="mb-3 flex-row items-center justify-between px-6">
        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: post.author.avatarUrl }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
            className="bg-muted"
          />
          <View>
            <Text className="text-foreground text-sm font-semibold">
              @{post.author.username}
            </Text>
            <View className="flex-row items-center gap-1">
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

      <View className="px-6">
        <PostPhotoCarousel photos={post.photos} />
      </View>

      {post.caption ? (
        <Text className="text-foreground px-6 pt-3 text-sm">
          {post.caption}
        </Text>
      ) : null}
    </View>
  );
}
