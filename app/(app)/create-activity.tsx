import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { CapacityField } from '@/features/activities/create/components/fields/CapacityField';
import { DateTimeField } from '@/features/activities/create/components/fields/DateTimeField';
import { EmojiField } from '@/features/activities/create/components/fields/EmojiField';
import { GenderField } from '@/features/activities/create/components/fields/GenderField';
import {
  SLOT_FONT_SIZE,
  SLOT_LINE_HEIGHT,
} from '@/features/activities/create/components/fields/Pill';
import { PlaceField } from '@/features/activities/create/components/fields/PlaceField';
import { TitleField } from '@/features/activities/create/components/fields/TitleField';
import { InlineDateTimePicker } from '@/features/activities/create/components/InlineDateTimePicker';
import { useCreateActivityFlow } from '@/features/activities/create/hooks/useCreateActivityFlow';
import { useDraftActivityStore } from '@/features/activities/create/stores/draftActivityStore';
import { ApiError } from '@/lib/api/types';
import { relativeDateUsesOnConnector } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useRouter } from 'expo-router';
import { CloseCircle } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';

export default function CreateActivityScreen() {
  const router = useRouter();
  const draft = useDraftActivityStore((s) => s.draft);
  const setField = useDraftActivityStore((s) => s.setField);
  const reset = useDraftActivityStore((s) => s.reset);

  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  const { submit, canSubmit, isPending } = useCreateActivityFlow();

  React.useEffect(() => () => reset(), [reset]);

  const onSubmit = async () => {
    try {
      await submit();
      toast.success('activity posted.');
      router.back();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "couldn't post that. try again.";
      toast.error(message);
    }
  };

  return (
    <>
      <Screen>
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Icon as={CloseCircle} className="text-muted-foreground size-7" />
          </Pressable>
          <Text className="text-foreground text-base font-semibold">
            new activity
          </Text>
          <View className="size-7" />
        </View>

        <View className="flex-1 px-6 pb-4">
          <View className="flex-1" />

          <InlineDateTimePicker
            value={draft.startsAt}
            onChange={(d) => setField('startsAt', d)}
            open={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
          />

          <View className="mb-6 flex-row flex-wrap items-center gap-x-2 gap-y-1.5">
            <Word>i want to</Word>
            <TitleField
              value={draft.title}
              onChange={(t) => setField('title', t)}
            />
            <EmojiField
              value={draft.emoji}
              onPress={() => setEmojiOpen(true)}
            />
            {draft.startsAt === null ||
            relativeDateUsesOnConnector(draft.startsAt) ? (
              <Word>on</Word>
            ) : null}
            <DateTimeField
              value={draft.startsAt}
              onPress={() => setDatePickerOpen((v) => !v)}
            />
            <Word>at</Word>
            <PlaceField
              value={draft.place}
              onPress={() => router.push('/place-picker')}
            />
            <Word>with</Word>
            <CapacityField
              value={draft.capacity}
              onChange={(c) => setField('capacity', c)}
            />
            <GenderField
              value={draft.genderPreference}
              onChange={(g) => setField('genderPreference', g)}
            />
          </View>

          <Button
            onPress={onSubmit}
            size="lg"
            disabled={!canSubmit || isPending}
          >
            {isPending ? (
              <LoadingIndicator color="white" />
            ) : (
              <Text>create</Text>
            )}
          </Button>
        </View>
      </Screen>

      <EmojiPicker
        open={emojiOpen}
        onClose={() => setEmojiOpen(false)}
        onEmojiSelected={(e) => {
          setField('emoji', e.emoji);
          setEmojiOpen(false);
        }}
        disabledCategories={['flags']}
      />
    </>
  );
}

function Word({ children }: { children: React.ReactNode }) {
  return (
    <Text
      className="text-foreground font-medium"
      style={{ fontSize: SLOT_FONT_SIZE, lineHeight: SLOT_LINE_HEIGHT }}
    >
      {children}
    </Text>
  );
}
