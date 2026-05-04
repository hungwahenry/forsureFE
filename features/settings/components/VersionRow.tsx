import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { toast } from '@/lib/toast';
import Constants from 'expo-constants';
import { InfoCircle } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

const TAPS_TO_UNLOCK = 10;
const RESET_AFTER_MS = 2000;

interface VersionRowProps {
  /** Fires when the row is tapped {TAPS_TO_UNLOCK} times in quick succession. */
  onUnlock: () => void;
}

export function VersionRow({ onUnlock }: VersionRowProps) {
  const version = Constants.expoConfig?.version ?? '—';
  const count = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPress = () => {
    if (timer.current) clearTimeout(timer.current);
    count.current += 1;
    const n = count.current;
    if (n === 3) toast('👀');
    else if (n === 6) toast('almost...');
    else if (n === 9) toast('one more!');
    else if (n >= TAPS_TO_UNLOCK) {
      count.current = 0;
      onUnlock();
      return;
    }
    timer.current = setTimeout(() => {
      count.current = 0;
    }, RESET_AFTER_MS);
  };

  return (
    <Pressable
      onPress={onPress}
      className="border-border/40 flex-row items-center gap-3 border-b px-6 py-4"
    >
      <Icon as={InfoCircle} className="text-muted-foreground size-5" />
      <Text className="text-foreground flex-1 text-base">version</Text>
      <Text className="text-muted-foreground text-sm">{version}</Text>
    </Pressable>
  );
}
