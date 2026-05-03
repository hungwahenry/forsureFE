import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PostPhotoCarousel } from '@/features/posts/components/PostPhotoCarousel';
import { formatChatDate } from '@/lib/format';
import { Global, People } from 'iconsax-react-nativejs';
import { View } from 'react-native';
import type { UserPost } from '../types';

interface UserPostCardProps {
  post: UserPost;
}

export function UserPostCard({ post }: UserPostCardProps) {
  const created = formatChatDate(new Date(post.createdAt));

  return (
    <View className="border-border/40 border-b py-4">
      <View className="mb-2 px-6">
        <Text className="text-foreground text-base leading-6">
          from{' '}
          <Text className="font-medium">
            {post.activity.emoji} {post.activity.title}
          </Text>
        </Text>
        <View className="mt-0.5 flex-row items-center gap-1">
          <Icon
            as={post.visibility === 'PUBLIC' ? Global : People}
            className="text-muted-foreground size-3"
          />
          <Text className="text-muted-foreground text-xs">
            {post.visibility === 'PUBLIC' ? 'public' : 'group'} · {created}
          </Text>
        </View>
      </View>

      {post.caption ? (
        <Text className="text-foreground mb-3 px-6 text-sm">
          {post.caption}
        </Text>
      ) : null}

      <View className="px-6">
        <PostPhotoCarousel photos={post.photos} />
      </View>
    </View>
  );
}
