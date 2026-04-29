import { useCreateActivity } from '../api/createActivity';
import { useDraftActivityStore } from '../stores/draftActivityStore';
import type { Activity, CreateActivityPayload } from '../types';

/**
 * Submits the draft activity and resets the draft on success. Validation of
 * required fields happens at the call site (the sheet won't enable the
 * "create" button until everything's filled), so this hook just shapes the
 * draft into the API payload.
 */
export function useCreateActivityFlow() {
  const createActivity = useCreateActivity();
  const reset = useDraftActivityStore((s) => s.reset);

  const submit = async (): Promise<Activity> => {
    const { draft } = useDraftActivityStore.getState();
    if (
      !draft.emoji ||
      !draft.title.trim() ||
      !draft.startsAt ||
      !draft.place
    ) {
      throw new Error('activity draft is incomplete');
    }

    const payload: CreateActivityPayload = {
      emoji: draft.emoji,
      title: draft.title.trim(),
      startsAt: draft.startsAt.toISOString(),
      placeName: draft.place.name,
      placeLat: draft.place.lat,
      placeLng: draft.place.lng,
      capacity: draft.capacity,
      genderPreference: draft.genderPreference,
    };

    const activity = await createActivity.mutateAsync(payload);
    reset();
    return activity;
  };

  return {
    submit,
    isPending: createActivity.isPending,
  };
}
