import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { PlacePicker } from '@/features/places/components/PlacePicker';
import { ApiError } from '@/lib/api/types';
import { formatRelativeDateTime } from '@/lib/format';
import { toast } from '@/lib/toast';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { View } from 'react-native';
import { useCreateActivityFlow } from '../hooks/useCreateActivityFlow';
import { useDraftActivityStore } from '../stores/draftActivityStore';
import type { ActivityGenderPreference } from '../types';
import { CapacitySheet } from './CapacitySheet';
import { DateTimeSheet } from './DateTimeSheet';
import { EmojiSheet } from './EmojiSheet';
import { GenderSheet } from './GenderSheet';
import { Slot } from './Slot';
import { TitleSheet } from './TitleSheet';

const GENDER_LABEL: Record<ActivityGenderPreference, string> = {
  ALL: 'people',
  FEMALE: 'girls',
  MALE: 'guys',
};

export const CreateActivitySheet = React.forwardRef<BottomSheetModal>(
  function CreateActivitySheet(_props, ref) {
    const draft = useDraftActivityStore((s) => s.draft);
    const setField = useDraftActivityStore((s) => s.setField);
    const reset = useDraftActivityStore((s) => s.reset);

    const { submit, isPending } = useCreateActivityFlow();

    // Sub-sheet refs — each slot's tap target.
    const emojiRef = React.useRef<BottomSheetModal>(null);
    const titleRef = React.useRef<BottomSheetModal>(null);
    const datetimeRef = React.useRef<BottomSheetModal>(null);
    const placeRef = React.useRef<BottomSheetModal>(null);
    const capacityRef = React.useRef<BottomSheetModal>(null);
    const genderRef = React.useRef<BottomSheetModal>(null);

    const canSubmit =
      !!draft.emoji &&
      !!draft.title.trim() &&
      !!draft.startsAt &&
      !!draft.place;

    const onSubmit = async () => {
      try {
        await submit();
        toast.success('activity posted.');
        (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
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
        <BottomSheet
          ref={ref}
          snapPoints={['62%']}
          enableDynamicSizing={false}
          onDismiss={reset}
        >
          <View className="flex-1 px-6 pt-2">
            <Text className="text-foreground mb-2 text-base font-semibold">
              new activity
            </Text>

            <Text className="text-foreground text-3xl font-medium leading-relaxed">
              you want to{' '}
              <Slot
                value={draft.emoji}
                placeholder="🙂"
                onPress={() => emojiRef.current?.present()}
              />{' '}
              <Slot
                value={draft.title || null}
                placeholder="activity"
                onPress={() => titleRef.current?.present()}
              />
              {'\n'}on{' '}
              <Slot
                value={
                  draft.startsAt
                    ? formatRelativeDateTime(draft.startsAt)
                    : null
                }
                placeholder="when"
                onPress={() => datetimeRef.current?.present()}
              />
              {'\n'}at{' '}
              <Slot
                value={draft.place?.name}
                placeholder="where"
                onPress={() => placeRef.current?.present()}
              />
              {'\n'}with{' '}
              <Slot
                value={String(draft.capacity)}
                placeholder="?"
                onPress={() => capacityRef.current?.present()}
              />{' '}
              <Slot
                value={GENDER_LABEL[draft.genderPreference]}
                placeholder="people"
                onPress={() => genderRef.current?.present()}
              />
              .
            </Text>

            <View className="flex-1" />

            <Button
              onPress={onSubmit}
              size="lg"
              disabled={!canSubmit || isPending}
              className="mb-2"
            >
              {isPending ? (
                <LoadingIndicator color="white" />
              ) : (
                <Text>create</Text>
              )}
            </Button>
          </View>
        </BottomSheet>

        <EmojiSheet
          ref={emojiRef}
          onSelect={(e) => setField('emoji', e)}
        />
        <TitleSheet
          ref={titleRef}
          initialValue={draft.title}
          onSubmit={(t) => setField('title', t)}
        />
        <DateTimeSheet
          ref={datetimeRef}
          initialValue={draft.startsAt}
          onSubmit={(d) => setField('startsAt', d)}
        />
        <PlacePicker
          ref={placeRef}
          onSelect={(p) => setField('place', p)}
        />
        <CapacitySheet
          ref={capacityRef}
          initialValue={draft.capacity}
          onSubmit={(c) => setField('capacity', c)}
        />
        <GenderSheet
          ref={genderRef}
          initialValue={draft.genderPreference}
          onSubmit={(g) => setField('genderPreference', g)}
        />
      </>
    );
  },
);
