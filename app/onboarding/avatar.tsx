import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { useUploadAvatar } from '@/features/onboarding/api/uploadAvatar';
import { StepShell } from '@/features/onboarding/components/StepShell';
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore';
import {
  pickFromCamera,
  pickFromLibrary,
  type PickedAsset,
  type PickerResult,
} from '@/lib/permissions/imagePicker';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { router } from 'expo-router';
import { Camera, Gallery } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';

const TOTAL_STEPS = 6;

export default function AvatarStep() {
  const draftAvatarKey = useOnboardingStore((s) => s.draft.avatarKey);
  const draftAvatarUrl = useOnboardingStore((s) => s.draft.avatarUrl);
  const setField = useOnboardingStore((s) => s.setField);

  // Locally previewed (pre-upload) URI; switches to draftAvatarUrl after upload.
  const [localUri, setLocalUri] = React.useState<string | null>(null);

  const uploadAvatar = useUploadAvatar();

  const handlePick = async (
    pickFn: () => Promise<PickerResult>,
  ) => {
    const result = await pickFn();
    if (result.status === 'denied') {
      toast.error(
        'permission denied — enable photo access in settings to continue.',
      );
      return;
    }
    if (result.status === 'unsupported') {
      toast.error('unsupported image format. use jpeg, png, or webp.');
      return;
    }
    if (result.status === 'cancelled') return;
    void uploadSelectedAsset(result.asset);
  };

  const uploadSelectedAsset = async (asset: PickedAsset) => {
    setLocalUri(asset.uri);
    try {
      const { key, url } = await uploadAvatar.mutateAsync({
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
      setField('avatarKey', key);
      setField('avatarUrl', url);
    } catch (err) {
      setLocalUri(null);
      const message =
        err instanceof ApiError
          ? err.message
          : 'upload failed. try again.';
      toast.error(message);
    }
  };

  const onContinue = () => {
    if (!draftAvatarKey) return;
    router.push('/onboarding/gender');
  };

  const previewSrc = draftAvatarUrl ?? localUri;
  const canContinue = !!draftAvatarKey && !uploadAvatar.isPending;

  return (
    <StepShell
      step={4}
      totalSteps={TOTAL_STEPS}
      title="add a profile photo"
      subtitle="other users see this on your activities."
      onContinue={onContinue}
      continueDisabled={!canContinue}
      continueLoading={uploadAvatar.isPending}
    >
      <View className="items-center gap-8">
        <View className="bg-muted/40 border-foreground/15 size-36 items-center justify-center overflow-hidden rounded-full border-2">
          {previewSrc ? (
            <Image
              source={{ uri: previewSrc }}
              style={{ width: 144, height: 144 }}
              contentFit="cover"
            />
          ) : (
            <Icon as={Camera} className="text-muted-foreground size-12" />
          )}
          {uploadAvatar.isPending ? (
            <View className="bg-background/60 absolute inset-0 items-center justify-center">
              <LoadingIndicator size={10} />
            </View>
          ) : null}
        </View>

        <View className="w-full flex-row gap-3">
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => handlePick(pickFromLibrary)}
            disabled={uploadAvatar.isPending}
            leftIcon={
              <Icon as={Gallery} className="text-foreground size-5" />
            }
          >
            <Text>library</Text>
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => handlePick(pickFromCamera)}
            disabled={uploadAvatar.isPending}
            leftIcon={
              <Icon as={Camera} className="text-foreground size-5" />
            }
          >
            <Text>camera</Text>
          </Button>
        </View>
      </View>
    </StepShell>
  );
}
