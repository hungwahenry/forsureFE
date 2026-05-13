import { useActivityDetails } from '@/features/activities/details/api/getDetails';
import type { ActivityDetails } from '@/features/activities/types';
import { useFeatureFlag } from '@/features/feature-flags/hooks/useFeatureFlag';
import * as React from 'react';
import { useMyActivityPost } from '@/features/posts/api/getMyPost';
import {
  useCreateActivityPost,
  useUpdateActivityPost,
} from '@/features/posts/api/upsertPost';
import type { PendingPhoto, PostVisibility } from '@/features/posts/types';

export const POST_MAX_PHOTOS = 5;
export const POST_CAPTION_MAX = 500;

export interface ExistingComposePhoto {
  kind: 'existing';
  id: string;
  uri: string;
}

export interface NewComposePhoto {
  kind: 'new';
  localId: string;
  uri: string;
  mimeType: string;
}

export type ComposePhoto = ExistingComposePhoto | NewComposePhoto;

let localCounter = 0;
const nextLocalId = () => `local_${++localCounter}`;

export interface ComposePostFlow {
  isLoading: boolean;
  isPending: boolean;
  isEditing: boolean;
  shareable: boolean;
  activity: ActivityDetails | null;
  photos: ComposePhoto[];
  caption: string;
  visibility: PostVisibility;
  remainingSlots: number;
  canSubmit: boolean;
  setCaption: (value: string) => void;
  setVisibility: (value: PostVisibility) => void;
  addPhotos: (photos: PendingPhoto[]) => void;
  removePhoto: (photo: ComposePhoto) => void;
  submit: () => Promise<void>;
}

export function useComposePost(activityId: string): ComposePostFlow {
  const details = useActivityDetails(activityId, !!activityId);
  const myPost = useMyActivityPost(activityId, !!activityId);
  const createMutation = useCreateActivityPost();
  const updateMutation = useUpdateActivityPost();

  const [photos, setPhotos] = React.useState<ComposePhoto[]>([]);
  const [caption, setCaption] = React.useState('');
  const [visibility, setVisibility] =
    React.useState<PostVisibility>('PARTICIPANTS');
  const initialized = React.useRef(false);

  const activity = details.data ?? null;
  const existingPost = myPost.data ?? null;
  const isLoading = details.isPending || myPost.isPending;
  const publicMemoriesEnabled = useFeatureFlag(
    'public_memories_sharing_enabled',
  );
  const shareable =
    activity?.memoriesShareablePublicly === true && publicMemoriesEnabled;
  const isEditing = existingPost != null;
  const isPending = createMutation.isPending || updateMutation.isPending;
  const remainingSlots = Math.max(0, POST_MAX_PHOTOS - photos.length);
  const canSubmit = !isPending && !isLoading && photos.length > 0;

  React.useEffect(() => {
    if (initialized.current || isLoading) return;
    initialized.current = true;
    if (existingPost) {
      setPhotos(
        existingPost.photos.map((p) => ({
          kind: 'existing',
          id: p.id,
          uri: p.imageUrl,
        })),
      );
      setCaption(existingPost.caption ?? '');
      setVisibility(existingPost.visibility);
    }
  }, [existingPost, isLoading]);

  const addPhotos = React.useCallback(
    (incoming: PendingPhoto[]) => {
      setPhotos((prev) => {
        const slots = Math.max(0, POST_MAX_PHOTOS - prev.length);
        const additions: NewComposePhoto[] = incoming
          .slice(0, slots)
          .map((p) => ({
            kind: 'new',
            localId: nextLocalId(),
            uri: p.uri,
            mimeType: p.mimeType,
          }));
        return [...prev, ...additions];
      });
    },
    [],
  );

  const removePhoto = React.useCallback((target: ComposePhoto) => {
    setPhotos((prev) =>
      prev.filter((p) =>
        target.kind === 'existing'
          ? !(p.kind === 'existing' && p.id === target.id)
          : !(p.kind === 'new' && p.localId === target.localId),
      ),
    );
  }, []);

  const submit = React.useCallback(async () => {
    const newPhotos: PendingPhoto[] = photos
      .filter((p): p is NewComposePhoto => p.kind === 'new')
      .map((p) => ({ uri: p.uri, mimeType: p.mimeType }));
    const trimmed = caption.trim();
    const visibilityToSend: PostVisibility = shareable
      ? visibility
      : 'PARTICIPANTS';

    if (existingPost) {
      const keepPhotoIds = photos
        .filter((p): p is ExistingComposePhoto => p.kind === 'existing')
        .map((p) => p.id);
      await updateMutation.mutateAsync({
        activityId,
        postId: existingPost.id,
        caption: trimmed,
        visibility: visibilityToSend,
        keepPhotoIds,
        newPhotos,
      });
    } else {
      await createMutation.mutateAsync({
        activityId,
        caption: trimmed,
        visibility: visibilityToSend,
        newPhotos,
      });
    }
  }, [
    activityId,
    caption,
    createMutation,
    existingPost,
    photos,
    shareable,
    updateMutation,
    visibility,
  ]);

  return {
    isLoading,
    isPending,
    isEditing,
    shareable,
    activity,
    photos,
    caption,
    visibility,
    remainingSlots,
    canSubmit,
    setCaption,
    setVisibility,
    addPhotos,
    removePhoto,
    submit,
  };
}
