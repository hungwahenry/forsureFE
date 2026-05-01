import { useEditActivity } from '../api/editActivity';
import { useEditDraftStore, type EditDraft } from '../stores/editDraftStore';
import type { ActivityDetails, EditActivityPayload } from '../../types';

function computeDelta(
  original: ActivityDetails,
  draft: EditDraft,
): EditActivityPayload {
  const patch: EditActivityPayload = {};

  if (draft.emoji !== original.emoji) patch.emoji = draft.emoji;
  if (draft.title.trim() !== original.title) patch.title = draft.title.trim();
  if (draft.startsAt.toISOString() !== original.startsAt)
    patch.startsAt = draft.startsAt.toISOString();

  const placeChanged =
    draft.place.name !== original.place.name ||
    draft.place.lat !== original.place.lat ||
    draft.place.lng !== original.place.lng;
  if (placeChanged) {
    patch.placeName = draft.place.name;
    patch.placeLat = draft.place.lat;
    patch.placeLng = draft.place.lng;
  }

  if (draft.capacity !== original.capacity) patch.capacity = draft.capacity;
  if (draft.genderPreference !== original.genderPreference)
    patch.genderPreference = draft.genderPreference;
  if (draft.memoriesShareablePublicly !== original.memoriesShareablePublicly)
    patch.memoriesShareablePublicly = draft.memoriesShareablePublicly;

  return patch;
}

export function useEditActivityFlow(original: ActivityDetails) {
  const editActivity = useEditActivity();
  const draft = useEditDraftStore((s) => s.draft);

  const delta = draft ? computeDelta(original, draft) : null;
  const hasChanges = !!delta && Object.keys(delta).length > 0;
  const canSubmit = hasChanges && !editActivity.isPending;

  const submit = async () => {
    if (!draft || !delta || !hasChanges) throw new Error('nothing to save');
    await editActivity.mutateAsync({ activityId: original.id, patch: delta });
  };

  return {
    submit,
    canSubmit,
    isPending: editActivity.isPending,
  };
}
