import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useActivityDetails } from '@/features/activities/details/api/getDetails';
import { CapacityField } from '@/features/activities/components/fields/CapacityField';
import { DateTimeField } from '@/features/activities/components/fields/DateTimeField';
import { EmojiField } from '@/features/activities/components/fields/EmojiField';
import { GenderField } from '@/features/activities/components/fields/GenderField';
import {
  SLOT_FONT_SIZE,
  SLOT_LINE_HEIGHT,
} from '@/features/activities/components/fields/Pill';
import { PlaceField } from '@/features/activities/components/fields/PlaceField';
import { TitleField } from '@/features/activities/components/fields/TitleField';
import { InlineDateTimePicker } from '@/features/activities/components/InlineDateTimePicker';
import { useEditActivityFlow } from '@/features/activities/manage/hooks/useEditActivityFlow';
import { useEditDraftStore } from '@/features/activities/manage/stores/editDraftStore';
import { ApiError } from '@/lib/api/types';
import { relativeDateUsesOnConnector } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';

export default function EditActivityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ activityId: string }>();
  const activityId = params.activityId;

  const details = useActivityDetails(activityId, !!activityId);
  const initialize = useEditDraftStore((s) => s.initialize);
  const reset = useEditDraftStore((s) => s.reset);
  const draft = useEditDraftStore((s) => s.draft);
  const setField = useEditDraftStore((s) => s.setField);

  // Initialize once when details load
  const initialized = React.useRef(false);
  React.useEffect(() => {
    if (details.data && !initialized.current) {
      initialize(details.data);
      initialized.current = true;
    }
  }, [details.data, initialize]);

  // Reset on unmount
  React.useEffect(() => () => { reset(); initialized.current = false; }, [reset]);

  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  const data = details.data ?? null;
  const genderLocked = data != null && data.participantCount > 1;

  const { submit, canSubmit, isPending } = useEditActivityFlow(
    data ?? {
      id: activityId,
      emoji: '',
      title: '',
      startsAt: new Date().toISOString(),
      place: { name: '', lat: 0, lng: 0 },
      capacity: 3,
      participantCount: 1,
      genderPreference: 'ALL',
      status: 'OPEN',
      host: { userId: '', username: '', displayName: '', avatarUrl: '', joinedAt: '' },
      members: [],
      pinnedMessage: null,
    },
  );

  const onSubmit = async () => {
    try {
      await submit();
      toast.success('activity updated.');
      router.back();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't save that. try again.";
      toast.error(message);
    }
  };

  if (!draft) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      </Screen>
    );
  }

  return (
    <>
      <Screen>
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
          </Pressable>
          <Text className="text-foreground text-base font-semibold">
            edit activity
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
              onPress={() => router.push('/place-picker?mode=edit')}
            />
            <Word>with</Word>
            <CapacityField
              value={draft.capacity}
              onChange={(c) => setField('capacity', c)}
            />
            <GenderField
              value={draft.genderPreference}
              onChange={(g) => setField('genderPreference', g)}
              disabled={genderLocked}
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
              <Text>save changes</Text>
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
