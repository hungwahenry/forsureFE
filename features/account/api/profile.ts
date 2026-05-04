import { myProfileQueryKey } from '@/features/users/api/getMyProfile';
import type { MyProfile } from '@/features/users/types';
import { api } from '@/lib/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateProfileArgs {
  displayName?: string;
  bio?: string;
  location?: { placeName: string; lat: number; lng: number };
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: UpdateProfileArgs) => {
      const res = await api.patch<MyProfile>('/v1/account/profile', args);
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(myProfileQueryKey(), data);
      void qc.invalidateQueries({ queryKey: ['users', data.username] });
    },
  });
}

export function useUpdateAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: { uri: string; mimeType: string }) => {
      const form = new FormData();
      const filename = `avatar.${file.mimeType.split('/')[1] ?? 'jpg'}`;
      form.append('file', {
        uri: file.uri,
        name: filename,
        type: file.mimeType,
      } as unknown as Blob);
      const res = await api.post<MyProfile>('/v1/account/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(myProfileQueryKey(), data);
      void qc.invalidateQueries({ queryKey: ['users', data.username] });
    },
  });
}
