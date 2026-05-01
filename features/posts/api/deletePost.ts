import { api } from '@/lib/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activityPostsQueryKey } from './listPosts';
import { myActivityPostQueryKey } from './getMyPost';

export interface DeletePostArgs {
  activityId: string;
  postId: string;
}

export function useDeleteActivityPost() {
  const qc = useQueryClient();
  return useMutation<void, unknown, DeletePostArgs>({
    mutationFn: async ({ activityId, postId }) => {
      await api.delete(`/v1/activities/${activityId}/posts/${postId}`);
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: activityPostsQueryKey(vars.activityId) });
      void qc.invalidateQueries({ queryKey: myActivityPostQueryKey(vars.activityId) });
    },
  });
}
