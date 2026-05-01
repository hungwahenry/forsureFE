import { pickFreeformFromLibrary } from '@/lib/permissions/imagePicker';
import { toast } from '@/lib/toast';
import * as React from 'react';
import { MESSAGE_IMAGE_MAX_BYTES } from '../validation/schemas';
import type { PendingImage } from '../types';

export function useMessageImagePicker() {
  const [image, setImage] = React.useState<PendingImage | null>(null);

  const pick = async () => {
    const result = await pickFreeformFromLibrary();
    if (result.status === 'denied') {
      toast.error('photo library access denied');
      return;
    }
    if (result.status === 'unsupported') {
      toast.error('unsupported image format. use jpeg, png, or webp.');
      return;
    }
    if (result.status !== 'picked') return;
    if (result.asset.fileSize != null && result.asset.fileSize > MESSAGE_IMAGE_MAX_BYTES) {
      toast.error('image is too large. max 10 MB.');
      return;
    }
    setImage({
      uri: result.asset.uri,
      mimeType: result.asset.mimeType ?? 'image/jpeg',
    });
  };

  const clearImage = () => setImage(null);

  return { image, pick, clearImage };
}
