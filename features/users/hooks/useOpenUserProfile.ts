import { useRouter } from 'expo-router';
import * as React from 'react';

export function useOpenUserProfile() {
  const router = useRouter();
  return React.useCallback(
    (username: string) => {
      router.push({
        pathname: '/users/[username]',
        params: { username },
      });
    },
    [router],
  );
}
