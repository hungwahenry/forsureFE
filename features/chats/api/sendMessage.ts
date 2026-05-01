import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { ChatMessage } from '../types';

export interface SendMessageArgs {
  activityId: string;
  body?: string;
  parentMessageId?: string;
  image?: { uri: string; mimeType: string };
}

export function useSendMessage() {
  return useMutation<ChatMessage, unknown, SendMessageArgs>({
    mutationFn: async ({ activityId, body, parentMessageId, image }) => {
      const formData = new FormData();
      if (body) formData.append('body', body);
      if (parentMessageId) formData.append('parentMessageId', parentMessageId);
      if (image) {
        const ext = image.mimeType.split('/')[1] || 'jpg';
        formData.append('image', {
          uri: image.uri,
          type: image.mimeType,
          name: `chat-image.${ext}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      }
      const res = await api.post<ChatMessage>(
        `/v1/chats/${activityId}/messages`,
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
