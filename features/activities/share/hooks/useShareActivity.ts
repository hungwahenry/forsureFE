import { useRouter } from 'expo-router';
import * as React from 'react';
import type { SharableActivity } from '../components/ActivityShareCard';
import { useShareTargetStore } from '../store';

export function useShareActivity(activity: SharableActivity | null) {
  const router = useRouter();
  const setTarget = useShareTargetStore((s) => s.setTarget);

  return React.useCallback(() => {
    if (!activity) return;
    setTarget(activity);
    router.push('/share-activity' as never);
  }, [activity, router, setTarget]);
}
