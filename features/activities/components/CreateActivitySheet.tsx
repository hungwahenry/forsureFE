import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { View } from 'react-native';
import { useCreateActivityFlow } from '../hooks/useCreateActivityFlow';
import { useDraftActivityStore } from '../stores/draftActivityStore';
import { CapacityField } from './fields/CapacityField';
import { DateTimeField } from './fields/DateTimeField';
import { EmojiField } from './fields/EmojiField';
import { GenderField } from './fields/GenderField';
import { PlaceField } from './fields/PlaceField';
import { TitleField } from './fields/TitleField';

/**
 * Mad-libs sentence as a flex-wrap row. Static text fragments are siblings
 * of the input/picker fields; each field owns its own state and (where
 * needed) sub-sheet. The sheet itself just holds the layout + submit.
 */
export const CreateActivitySheet = React.forwardRef<BottomSheetModal>(
  function CreateActivitySheet(_props, ref) {
    const draft = useDraftActivityStore((s) => s.draft);
    const setField = useDraftActivityStore((s) => s.setField);
    const reset = useDraftActivityStore((s) => s.reset);

    const { submit, isPending } = useCreateActivityFlow();

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
      <BottomSheet
        ref={ref}
        snapPoints={['62%']}
        enableDynamicSizing={false}
        onDismiss={reset}
      >
        <View className="flex-1 px-6 pt-2">
          <Text className="text-foreground mb-4 text-base font-semibold">
            new activity
          </Text>

          {/* The mad-libs sentence. Each child is rendered inline; flex-wrap
              + items-baseline handles line breaks naturally. */}
          <View className="flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
            <Word>i want to</Word>
            <TitleField
              value={draft.title}
              onChange={(t) => setField('title', t)}
            />
            <EmojiField
              value={draft.emoji}
              onChange={(e) => setField('emoji', e)}
            />
            <Word>on</Word>
            <DateTimeField
              value={draft.startsAt}
              onChange={(d) => setField('startsAt', d)}
            />
            <Word>at</Word>
            <PlaceField
              value={draft.place}
              onChange={(p) => setField('place', p)}
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
            <Word>.</Word>
          </View>

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
    );
  },
);

/** Static word in the mad-libs sentence — sized to match the fields. */
function Word({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-foreground text-3xl font-medium">{children}</Text>
  );
}
