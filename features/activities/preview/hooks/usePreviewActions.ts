import { useJoinActivity } from '@/features/activities/join/api/joinActivity';
import { useFeatureFlag } from '@/features/feature-flags/hooks/useFeatureFlag';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { useRouter } from 'expo-router';
import * as React from 'react';
import type { ActivityPreview } from '../api/getPreview';

export interface PreviewCta {
  label: string;
  onPress: () => void;
  disabled: boolean;
  variant: 'default' | 'secondary';
}

export function usePreviewActions(
  activityId: string,
  preview: ActivityPreview | null,
) {
  const router = useRouter();
  const join = useJoinActivity();
  const joiningEnabled = useFeatureFlag('activity_joining_enabled');

  const onJoin = React.useCallback(async (): Promise<void> => {
    try {
      await join.mutateAsync(activityId);
      toast.success("you're going.");
      router.replace({ pathname: '/chat/[id]', params: { id: activityId } });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't join. try again.";
      toast.error(message);
    }
  }, [join, activityId, router]);

  const onOpenChat = React.useCallback(() => {
    router.replace({ pathname: '/chat/[id]', params: { id: activityId } });
  }, [router, activityId]);

  const cta: PreviewCta | null = React.useMemo(() => {
    if (!preview) return null;
    if (preview.viewerIsHost || preview.viewerIsMember) {
      return {
        label: 'open chat',
        onPress: onOpenChat,
        disabled: false,
        variant: 'secondary',
      };
    }
    // Status badge already conveys CANCELLED/DONE — no redundant CTA.
    if (preview.status !== 'OPEN') return null;
    if (preview.spotsLeft <= 0) {
      return {
        label: 'full',
        onPress: () => {},
        disabled: true,
        variant: 'default',
      };
    }
    if (!joiningEnabled) {
      return {
        label: 'joining paused',
        onPress: () => {},
        disabled: true,
        variant: 'default',
      };
    }
    return {
      label: 'join',
      onPress: () => void onJoin(),
      disabled: false,
      variant: 'default',
    };
  }, [preview, onJoin, onOpenChat, joiningEnabled]);

  return {
    cta,
    isJoining: join.isPending,
  };
}
