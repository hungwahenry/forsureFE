import * as ImagePicker from 'expo-image-picker';

export type PickedAsset = ImagePicker.ImagePickerAsset;

export type PickerResult =
  | { status: 'denied' }
  | { status: 'cancelled' }
  | { status: 'unsupported'; mimeType: string }
  | { status: 'picked'; asset: PickedAsset };

const SUPPORTED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const COMMON_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.85,
};

const FREEFORM_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: false,
  quality: 0.85,
};

function classify(asset: PickedAsset): PickerResult {
  if (asset.mimeType && !SUPPORTED_IMAGE_MIMES.has(asset.mimeType)) {
    return { status: 'unsupported', mimeType: asset.mimeType };
  }
  return { status: 'picked', asset };
}

export async function pickFromLibrary(): Promise<PickerResult> {
  const result = await ImagePicker.launchImageLibraryAsync(COMMON_OPTIONS);
  if (result.canceled) return { status: 'cancelled' };
  return classify(result.assets[0]);
}

export async function pickFreeformFromLibrary(): Promise<PickerResult> {
  const result = await ImagePicker.launchImageLibraryAsync(FREEFORM_OPTIONS);
  if (result.canceled) return { status: 'cancelled' };
  return classify(result.assets[0]);
}

export async function pickFromCamera(): Promise<PickerResult> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return { status: 'denied' };
  const result = await ImagePicker.launchCameraAsync(COMMON_OPTIONS);
  if (result.canceled) return { status: 'cancelled' };
  return classify(result.assets[0]);
}
