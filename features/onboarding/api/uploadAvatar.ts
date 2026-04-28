import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { AvatarUploadResponse } from '../types';

interface UploadAvatarArgs {
  /** Local file URI from expo-image-picker (e.g., file:///.../IMG_1234.jpg) */
  uri: string;
  /** mimeType from the picker asset, defaults to image/jpeg */
  mimeType?: string;
}

export function useUploadAvatar() {
  return useMutation<AvatarUploadResponse, unknown, UploadAvatarArgs>({
    mutationFn: async ({ uri, mimeType = 'image/jpeg' }) => {
      const ext = mimeType.split('/')[1] || 'jpg';
      const formData = new FormData();
      // RN's FormData accepts file-like objects with uri/type/name shape.
      formData.append('file', {
        uri,
        type: mimeType,
        name: `avatar.${ext}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const res = await api.post<AvatarUploadResponse>(
        '/v1/onboarding/avatar',
        formData,
        {
          // Let axios set the boundary header — manually setting Content-Type
          // strips the boundary and breaks the multipart parse on the server.
          headers: { 'Content-Type': 'multipart/form-data' },
          // Avoid axios trying to JSON-stringify the FormData.
          transformRequest: (data) => data,
        },
      );
      return res.data;
    },
  });
}
