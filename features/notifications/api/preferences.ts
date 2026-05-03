import { api } from '@/lib/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PreferencesResponse, PreferenceUpdate } from '../types';

export const notificationPreferencesQueryKey = () =>
  ['notifications', 'preferences'] as const;

export function useNotificationPreferences(enabled = true) {
  return useQuery({
    queryKey: notificationPreferencesQueryKey(),
    queryFn: async () => {
      const res = await api.get<PreferencesResponse>(
        '/v1/notifications/preferences',
      );
      return res.data;
    },
    enabled,
  });
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: PreferenceUpdate[]) => {
      const res = await api.patch<PreferencesResponse>(
        '/v1/notifications/preferences',
        { updates },
      );
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(notificationPreferencesQueryKey(), data);
    },
  });
}
