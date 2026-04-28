import * as ImagePicker from 'expo-image-picker';

export type PickedAsset = ImagePicker.ImagePickerAsset;

export type PickerResult =
  | { status: 'denied' }
  | { status: 'cancelled' }
  | { status: 'picked'; asset: PickedAsset };

const COMMON_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.85,
};

export async function pickFromLibrary(): Promise<PickerResult> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return { status: 'denied' };
  const result = await ImagePicker.launchImageLibraryAsync(COMMON_OPTIONS);
  if (result.canceled) return { status: 'cancelled' };
  return { status: 'picked', asset: result.assets[0] };
}

export async function pickFromCamera(): Promise<PickerResult> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return { status: 'denied' };
  const result = await ImagePicker.launchCameraAsync(COMMON_OPTIONS);
  if (result.canceled) return { status: 'cancelled' };
  return { status: 'picked', asset: result.assets[0] };
}
