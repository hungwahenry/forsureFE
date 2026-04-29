import { useRetrievePlace } from '../api/retrieve';
import type { PickedPlace, PlaceSuggestion } from '../types';

interface UsePickPlaceArgs {
  /** Active sessionToken — must match the one used for suggest calls. */
  sessionToken: string;
  /** Called after the retrieve completes so the caller can rotate to a new token. */
  onSessionUsed: () => void;
}

/**
 * Encapsulates the "user tapped a suggestion" rule:
 *  1. retrieve full details (closes the billing session)
 *  2. shape the PickedPlace using `suggestion.name` as the canonical
 *     display name (Google deliberately omits `displayName` to stay in the
 *     Essentials tier; Mapbox provides one but we ignore it for parity)
 *  3. notify the caller to renew the session token
 */
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
