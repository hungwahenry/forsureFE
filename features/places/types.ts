// Mirrors backend's normalized place shapes (provider-agnostic via PlaceSearchProvider).

export interface PlaceSuggestion {
  /** Opaque provider id — pass to retrieve. */
  id: string;
  name: string;
  description: string;
}

export interface PlaceDetails {
  id: string;
  // Often omitted by the backend (Google's Essentials tier); prefer suggestion.name.
  name?: string;
  address: string;
  lat: number;
  lng: number;
}

export interface PickedPlace {
  name: string;
  address: string;
  lat: number;
  lng: number;
}
