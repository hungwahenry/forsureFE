import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import type { NotificationEventCode } from '@/features/notifications/types';
import {
  usePreferences,
  useUpdatePreferences,
} from '@/features/preferences/api/preferences';
import { PreferenceToggle } from '@/features/preferences/components/PreferenceToggle';
import {
  NOTIFICATION_EVENT_LABEL,
  NOTIFICATION_EVENT_ORDER,
} from '@/features/preferences/labels';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const prefs = usePreferences();
  const update = useUpdatePreferences();

  const lookup = React.useMemo(() => {
    const map = new Map<string, boolean>();
    for (const e of prefs.data?.entries ?? []) {
      if (e.channel === 'PUSH') map.set(e.eventCode, e.enabled);
    }
    return map;
  }, [prefs.data]);

  const isEnabled = (event: NotificationEventCode) =>
    lookup.get(event) ?? false;

  const onToggle = (event: NotificationEventCode, next: boolean) => {
    update.mutate([{ eventCode: event, channel: 'PUSH', enabled: next }]);
  };

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          notification settings
        </Text>
        <View className="size-7" />
      </View>

      {prefs.isPending ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <Text className="text-muted-foreground px-6 pb-2 pt-4 text-xs">
            push notifications
          </Text>
          {NOTIFICATION_EVENT_ORDER.map((event) => (
            <PreferenceToggle
              key={event}
              label={NOTIFICATION_EVENT_LABEL[event]}
              enabled={isEnabled(event)}
              disabled={update.isPending}
              onChange={(next) => onToggle(event, next)}
            />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
