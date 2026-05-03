import { api } from '@/lib/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PreferencesResponse, PreferenceUpdate } from '../types';

export const preferencesQueryKey = () => ['preferences'] as const;

export function usePreferences(enabled = true) {
  return useQuery({
    queryKey: preferencesQueryKey(),
    queryFn: async () => {
      const res = await api.get<PreferencesResponse>(
        '/v1/preferences',
      );
      return res.data;
    },
    enabled,
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: PreferenceUpdate[]) => {
      const res = await api.patch<PreferencesResponse>(
        '/v1/preferences',
        { updates },
      );
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(preferencesQueryKey(), data);
    },
  });
}
