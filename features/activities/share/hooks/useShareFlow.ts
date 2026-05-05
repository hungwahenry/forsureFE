import { toast } from '@/lib/toast';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { type View } from 'react-native';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import { SHARE_CARD_SIZE, type SharableActivity } from '../components/ActivityShareCard';
import { useShareTargetStore } from '../store';

export type ShareFlowMode = 'idle' | 'save' | 'share';

const ACTIVITY_URL_BASE = 'https://forsure.fyi/a';

export function useShareFlow() {
  const router = useRouter();
  const target = useShareTargetStore((s) => s.target);
  const clear = useShareTargetStore((s) => s.clear);
  const cardRef = React.useRef<View>(null);
  const [mode, setMode] = React.useState<ShareFlowMode>('idle');

  // Defensive: bounce back if there's no target (e.g. direct deeplink to /share-activity).
  React.useEffect(() => {
    if (!target) router.back();
  }, [target, router]);

  // Clear target on unmount so a stale activity doesn't leak into the next open.
  React.useEffect(() => clear, [clear]);

  const capture = async (): Promise<string> => {
    if (!cardRef.current) throw new Error('Card not mounted');
    return captureRef(cardRef.current, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
      width: SHARE_CARD_SIZE,
      height: SHARE_CARD_SIZE,
    });
  };

  const onSave = async (): Promise<void> => {
    if (mode !== 'idle') return;
    setMode('save');
    try {
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        toast.error('photo access denied. enable in settings.');
        return;
      }
      const uri = await capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      toast.success('saved to photos.');
    } catch {
      toast.error("couldn't save. try again.");
    } finally {
      setMode('idle');
    }
  };

  const onShare = async (): Promise<void> => {
    if (mode !== 'idle' || !target) return;
    setMode('share');
    try {
      const uri = await capture();
      await Share.open({
        url: uri,
        type: 'image/png',
        message: buildShareMessage(target),
        failOnCancel: false,
      });
    } catch {
      toast.error("couldn't share. try again.");
    } finally {
      setMode('idle');
    }
  };

  return {
    target,
    cardRef,
    mode,
    isBusy: mode !== 'idle',
    onSave,
    onShare,
  };
}

function buildShareMessage(activity: SharableActivity): string {
  return `${activity.emoji} ${activity.title}\n${ACTIVITY_URL_BASE}/${activity.id}`;
}
