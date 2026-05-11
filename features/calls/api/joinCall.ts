import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';

export interface CallJoinResponse {
  token: string;
  roomId: string;
  username: string;
}

async function joinCall(activityId: string): Promise<CallJoinResponse> {
  const res = await api.post<CallJoinResponse>(
    `/v1/activities/${activityId}/call/join`,
  );
  return res.data;
}

export function useJoinCall(activityId: string) {
  return useMutation({
    mutationFn: () => joinCall(activityId),
  });
}
