import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { AvatarUploadResponse } from '../types';

interface UploadAvatarArgs {
  uri: string;
  mimeType?: string;
}

export function useUploadAvatar() {
  return useMutation<AvatarUploadResponse, unknown, UploadAvatarArgs>({
    mutationFn: async ({ uri, mimeType = 'image/jpeg' }) => {
      const ext = mimeType.split('/')[1] || 'jpg';
      const formData = new FormData();
      formData.append(
        'file',
        {
          uri,
          type: mimeType,
          name: `avatar.${ext}`,
        } as unknown as Blob,
      );

      const res = await api.post<AvatarUploadResponse>(
        '/v1/onboarding/avatar',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: (data) => data,
        },
      );
      return res.data;
    },
  });
}
