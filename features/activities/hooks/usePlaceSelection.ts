import { useDraftActivityStore } from '@/features/activities/create/stores/draftActivityStore';
import { useEditDraftStore } from '@/features/activities/manage/stores/editDraftStore';
import type { PickedPlace } from '@/features/places/types';
import { useRouter } from 'expo-router';

export function usePlaceSelection(mode: string | undefined) {
  const router = useRouter();
  const setCreateField = useDraftActivityStore((s) => s.setField);
  const setEditField = useEditDraftStore((s) => s.setField);

  const selectPlace = (p: PickedPlace, businessVenueId?: string) => {
    if (mode === 'edit') {
      setEditField('place', p);
      setEditField('businessVenueId', businessVenueId ?? null);
    } else {
      setCreateField('place', p);
      setCreateField('businessVenueId', businessVenueId ?? null);
    }
    router.back();
  };

  return { selectPlace };
}
