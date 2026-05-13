import { useCreateActivity } from '../api/createActivity';
import {
  isDraftActivityComplete,
  useDraftActivityStore,
} from '../stores/draftActivityStore';
import type { Activity, CreateActivityPayload } from '../../types';

export function useCreateActivityFlow() {
  const createActivity = useCreateActivity();
  const draft = useDraftActivityStore((s) => s.draft);
  const reset = useDraftActivityStore((s) => s.reset);

  const canSubmit = isDraftActivityComplete(draft);

  const submit = async (): Promise<Activity> => {
    if (!isDraftActivityComplete(draft)) {
      throw new Error('activity draft is incomplete');
    }

    const payload: CreateActivityPayload = {
      emoji: draft.emoji!,
      title: draft.title.trim(),
      startsAt: draft.startsAt!.toISOString(),
      placeName: draft.place!.name,
      placeLat: draft.place!.lat,
      placeLng: draft.place!.lng,
      capacity: draft.capacity,
      genderPreference: draft.genderPreference,
      ...(draft.businessVenueId
        ? { businessVenueId: draft.businessVenueId }
        : {}),
    };

    const activity = await createActivity.mutateAsync(payload);
    reset();
    return activity;
  };

  return {
    submit,
    canSubmit,
    isPending: createActivity.isPending,
  };
}
