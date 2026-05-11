import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useActivityDetails } from '@/features/activities/details/api/getDetails';
import { ActivitySentence } from '@/features/activities/components/ActivitySentence';
import { InlineDateTimePicker } from '@/features/activities/components/InlineDateTimePicker';
import { useEditActivityFlow } from '@/features/activities/manage/hooks/useEditActivityFlow';
import { useEditDraftStore } from '@/features/activities/manage/stores/editDraftStore';
import { ApiError } from '@/lib/api/types';
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

  const initialized = React.useRef(false);
  React.useEffect(() => {
    if (details.data && !initialized.current) {
      initialize(details.data);
      initialized.current = true;
    }
  }, [details.data, initialize]);

  React.useEffect(
    () => () => {
      reset();
      initialized.current = false;
    },
    [reset],
  );

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
      memoriesShareablePublicly: false,
      host: { userId: '', username: '', displayName: '', avatarUrl: '', joinedAt: '' },
      members: [],
      pinnedMessage: null,
      hmsRoomId: null,
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

          <View className="mb-6">
            <ActivitySentence
              draft={draft}
              onTitleChange={(t) => setField('title', t)}
              onEmojiPress={() => setEmojiOpen(true)}
              onDatePress={() => setDatePickerOpen((v) => !v)}
              onPlacePress={() => router.push('/place-picker?mode=edit')}
              onCapacityChange={(c) => setField('capacity', c)}
              onGenderChange={(g) => setField('genderPreference', g)}
              genderLocked={genderLocked}
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
