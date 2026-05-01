import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useDraftActivityStore } from '@/features/activities/create/stores/draftActivityStore';
import { useEditDraftStore } from '@/features/activities/manage/stores/editDraftStore';
import { PlacePicker } from '@/features/places/components/PlacePicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function PlacePickerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const isEdit = params.mode === 'edit';

  const setCreateField = useDraftActivityStore((s) => s.setField);
  const setEditField = useEditDraftStore((s) => s.setField);

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          where?
        </Text>
        <View className="size-7" />
      </View>

      <View className="flex-1 px-4 pb-4">
        <PlacePicker
          onSelect={(p) => {
            if (isEdit) {
              setEditField('place', p);
            } else {
              setCreateField('place', p);
            }
            router.back();
          }}
        />
      </View>
    </Screen>
  );
}
