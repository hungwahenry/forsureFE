import { useDraftActivityStore } from '@/features/activities/create/stores/draftActivityStore';
import { useEditDraftStore } from '@/features/activities/manage/stores/editDraftStore';
import type { PickedPlace } from '@/features/places/types';
import { useRouter } from 'expo-router';

export function usePlaceSelection(mode: string | undefined) {
  const router = useRouter();
  const setCreateField = useDraftActivityStore((s) => s.setField);
  const setEditField = useEditDraftStore((s) => s.setField);

  const selectPlace = (p: PickedPlace) => {
    if (mode === 'edit') {
      setEditField('place', p);
    } else {
      setCreateField('place', p);
    }
    router.back();
  };

  return { selectPlace };
}
