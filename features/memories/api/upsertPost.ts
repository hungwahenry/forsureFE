import { api } from '@/lib/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activityPostsQueryKey } from './listPosts';
import { myActivityPostQueryKey } from './getMyPost';
import type { ActivityPost, PendingPhoto, PostVisibility } from '../types';

interface BaseArgs {
  activityId: string;
  caption?: string;
  visibility?: PostVisibility;
  newPhotos?: PendingPhoto[];
}

export type CreatePostArgs = BaseArgs;

export interface UpdatePostArgs extends BaseArgs {
  postId: string;
  keepPhotoIds?: string[];
}

function buildFormData(args: BaseArgs & { keepPhotoIds?: string[] }): FormData {
  const fd = new FormData();
  if (args.caption !== undefined) fd.append('caption', args.caption);
  if (args.visibility !== undefined) fd.append('visibility', args.visibility);
  if (args.keepPhotoIds) {
    for (const id of args.keepPhotoIds) fd.append('keepPhotoIds', id);
  }
  if (args.newPhotos) {
    args.newPhotos.forEach((photo, idx) => {
      const ext = photo.mimeType.split('/')[1] || 'jpg';
      fd.append(
        'images',
        {
          uri: photo.uri,
          type: photo.mimeType,
          name: `memory-${idx}.${ext}`,
        } as unknown as Blob,
      );
    });
  }
  return fd;
}

export function useCreateActivityPost() {
  const qc = useQueryClient();
  return useMutation<ActivityPost, unknown, CreatePostArgs>({
    mutationFn: async (args) => {
      const fd = buildFormData(args);
      const res = await api.post<ActivityPost>(
        `/v1/activities/${args.activityId}/posts`,
        fd,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: (data) => data,
        },
      );
      return res.data;
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: activityPostsQueryKey(vars.activityId) });
      void qc.invalidateQueries({ queryKey: myActivityPostQueryKey(vars.activityId) });
    },
  });
}

export function useUpdateActivityPost() {
  const qc = useQueryClient();
  return useMutation<ActivityPost, unknown, UpdatePostArgs>({
    mutationFn: async (args) => {
      const fd = buildFormData(args);
      const res = await api.patch<ActivityPost>(
        `/v1/activities/${args.activityId}/posts/${args.postId}`,
        fd,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: (data) => data,
        },
      );
      return res.data;
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: activityPostsQueryKey(vars.activityId) });
      void qc.invalidateQueries({ queryKey: myActivityPostQueryKey(vars.activityId) });
    },
  });
}
