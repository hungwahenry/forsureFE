import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ActivitySentence } from '@/features/activities/components/ActivitySentence';
import { InlineDateTimePicker } from '@/features/activities/components/InlineDateTimePicker';
import { useCreateActivityFlow } from '@/features/activities/create/hooks/useCreateActivityFlow';
import { useDraftActivityStore } from '@/features/activities/create/stores/draftActivityStore';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
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
            <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
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

          <View className="mb-6">
            <ActivitySentence
              draft={draft}
              onTitleChange={(t) => setField('title', t)}
              onEmojiPress={() => setEmojiOpen(true)}
              onDatePress={() => setDatePickerOpen((v) => !v)}
              onPlacePress={() => router.push('/place-picker')}
              onCapacityChange={(c) => setField('capacity', c)}
              onGenderChange={(g) => setField('genderPreference', g)}
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
