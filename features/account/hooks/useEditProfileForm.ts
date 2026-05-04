import {
  useUpdateAvatar,
  useUpdateProfile,
} from '@/features/account/api/profile';
import { useMyProfile } from '@/features/users/api/getMyProfile';
import { ApiError } from '@/lib/api/types';
import { useDeviceLocation } from '@/lib/hooks/useDeviceLocation';
import { pickFromLibrary } from '@/lib/permissions/imagePicker';
import { toast } from '@/lib/toast';
import * as React from 'react';

export const NAME_MAX = 40;
export const BIO_MAX = 280;

interface FormLocation {
  placeName: string;
  lat: number;
  lng: number;
}

export function useEditProfileForm() {
  const profile = useMyProfile();
  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  const deviceLocation = useDeviceLocation();

  const [displayName, setDisplayNameRaw] = React.useState('');
  const [bio, setBioRaw] = React.useState('');
  const [location, setLocation] = React.useState<FormLocation | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (profile.data && !hydrated) {
      setDisplayNameRaw(profile.data.displayName);
      setBioRaw(profile.data.bio ?? '');
      setLocation({
        placeName: profile.data.place.name,
        lat: profile.data.place.lat,
        lng: profile.data.place.lng,
      });
      setHydrated(true);
    }
  }, [profile.data, hydrated]);

  const setDisplayName = (v: string) => setDisplayNameRaw(v.slice(0, NAME_MAX));
  const setBio = (v: string) => setBioRaw(v.slice(0, BIO_MAX));

  const dirty =
    profile.data != null &&
    location != null &&
    (displayName.trim() !== profile.data.displayName ||
      bio.trim() !== (profile.data.bio ?? '') ||
      location.placeName !== profile.data.place.name ||
      location.lat !== profile.data.place.lat ||
      location.lng !== profile.data.place.lng);

  const pickAndUploadAvatar = async (): Promise<void> => {
    const result = await pickFromLibrary();
    if (result.status === 'denied') {
      toast.error('photo library access denied');
      return;
    }
    if (result.status === 'unsupported') {
      toast.error('unsupported image format. use jpeg, png, or webp.');
      return;
    }
    if (result.status !== 'picked') return;
    try {
      await updateAvatar.mutateAsync({
        uri: result.asset.uri,
        mimeType: result.asset.mimeType ?? 'image/jpeg',
      });
      toast.success('avatar updated.');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't upload. try again.";
      toast.error(message);
    }
  };

  const useCurrentLocation = async (): Promise<void> => {
    const loc = await deviceLocation.fetch();
    if (!loc) {
      toast.error("couldn't get your location. try again.");
      return;
    }
    setLocation({ placeName: loc.placeName, lat: loc.lat, lng: loc.lng });
  };

  const save = async (): Promise<boolean> => {
    if (!dirty || !profile.data || !location) return false;
    try {
      await updateProfile.mutateAsync({
        displayName: displayName.trim(),
        bio: bio.trim(),
        location,
      });
      toast.success('saved.');
      return true;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't save. try again.";
      toast.error(message);
      return false;
    }
  };

  return {
    profile: profile.data ?? null,
    isPending: profile.isPending,
    displayName,
    setDisplayName,
    bio,
    setBio,
    location,
    useCurrentLocation,
    dirty,
    save,
    pickAndUploadAvatar,
    isSaving: updateProfile.isPending,
    isUploadingAvatar: updateAvatar.isPending,
    isFetchingLocation: deviceLocation.isFetching,
  };
}
