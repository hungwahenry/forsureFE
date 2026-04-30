import { useRetrievePlace } from '../api/retrieve';
import type { PickedPlace, PlaceSuggestion } from '../types';

interface UsePickPlaceArgs {
  /** Must match the token used for the suggest calls in the same session. */
  sessionToken: string;
  /** Fired after retrieve so the caller can rotate to a fresh token. */
  onSessionUsed: () => void;
}

// Uses suggestion.name as the canonical display name for provider parity (Google omits displayName on Essentials).
export function usePickPlace({ sessionToken, onSessionUsed }: UsePickPlaceArgs) {
  const retrieve = useRetrievePlace();

  const pickPlace = async (
    suggestion: PlaceSuggestion,
  ): Promise<PickedPlace> => {
    const details = await retrieve.mutateAsync({
      id: suggestion.id,
      sessionToken,
    });
    onSessionUsed();
    return {
      name: suggestion.name,
      address: details.address,
      lat: details.lat,
      lng: details.lng,
    };
  };

  return {
    pickPlace,
    isPending: retrieve.isPending,
  };
}
