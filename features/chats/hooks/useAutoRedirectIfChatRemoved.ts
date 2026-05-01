import { useRouter } from 'expo-router';
import * as React from 'react';
import type { ChatPreview } from '../types';

export function useAutoRedirectIfChatRemoved(
  preview: ChatPreview | null,
  isFetched: boolean,
) {
  const router = useRouter();
  const everFound = React.useRef(false);

  React.useEffect(() => {
    if (preview) everFound.current = true;
    if (!preview && everFound.current && isFetched) {
      router.back();
    }
  }, [preview, isFetched, router]);
}
