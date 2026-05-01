import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { CaptionField } from '@/features/memories/components/CaptionField';
import { PhotoGrid } from '@/features/memories/components/PhotoGrid';
import { VisibilitySelector } from '@/features/memories/components/VisibilitySelector';
import { useComposePost } from '@/features/memories/hooks/useComposePost';
import { ApiError } from '@/lib/api/types';
import { pickMultipleFromLibrary } from '@/lib/permissions/imagePicker';
import { toast } from '@/lib/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { Pressable, ScrollView, View } from 'react-native';

export default function PostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ activityId: string }>();
  const activityId = params.activityId;
  const flow = useComposePost(activityId ?? '');

  if (!activityId) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">missing activity.</Text>
        </View>
      </Screen>
    );
  }

  const onPickPhotos = async () => {
    if (flow.remainingSlots <= 0) return;
    const result = await pickMultipleFromLibrary(flow.remainingSlots);
    if (result.status === 'denied') {
      toast.error('photo library access denied');
      return;
    }
    if (result.status !== 'picked' || result.assets.length === 0) return;
    flow.addPhotos(
      result.assets.map((a) => ({
        uri: a.uri,
        mimeType: a.mimeType ?? 'image/jpeg',
      })),
    );
  };

  const onSubmit = async () => {
    try {
      await flow.submit();
      toast.success(flow.isEditing ? 'post updated.' : 'memory posted.');
      router.back();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't post. try again.";
      toast.error(message);
    }
  };

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          {flow.isEditing ? 'edit memory' : 'share memory'}
        </Text>
        <View className="size-7" />
      </View>

      {flow.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {flow.activity ? (
            <Text className="text-muted-foreground mb-3 text-sm">
              from {flow.activity.emoji} {flow.activity.title}
            </Text>
          ) : null}
          <CaptionField value={flow.caption} onChange={flow.setCaption} />
          <PhotoGrid
            photos={flow.photos}
            remainingSlots={flow.remainingSlots}
            onAdd={() => void onPickPhotos()}
            onRemove={flow.removePhoto}
          />
          <VisibilitySelector
            value={flow.visibility}
            onChange={flow.setVisibility}
            shareable={flow.shareable}
          />
        </ScrollView>
      )}

      <View className="border-border/40 border-t px-6 py-4">
        <Button
          onPress={() => void onSubmit()}
          size="lg"
          disabled={!flow.canSubmit}
        >
          {flow.isPending ? (
            <LoadingIndicator color="white" />
          ) : (
            <Text>{flow.isEditing ? 'save changes' : 'share memory'}</Text>
          )}
        </Button>
      </View>
    </Screen>
  );
}
