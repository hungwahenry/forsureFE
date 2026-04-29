import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { Activity, CreateActivityPayload } from '../types';

export function useCreateActivity() {
  return useMutation<Activity, unknown, CreateActivityPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<Activity>('/v1/activities', payload);
      return res.data;
    },
  });
}
