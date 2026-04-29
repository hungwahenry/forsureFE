/**
 * Mirrors the backend's normalized place shapes. Provider-agnostic
 * (Mapbox / Google) — the backend's PlaceSearchProvider abstraction
 * makes them identical at the API boundary.
 */

export interface PlaceSuggestion {
  /** Provider-specific opaque id — pass to retrieve. */
  id: string;
  /** Primary line: venue name. Use this as the canonical display value. */
  name: string;
  /** Secondary line: formatted address / context. */
  description: string;
}

export interface PlaceDetails {
  id: string;
  /**
   * Optional. Backend doesn't always populate it (Google deliberately omits
   * `displayName` to stay in the cheaper Essentials tier). Always prefer
   * the suggestion's `name` as the source of truth.
   */
  name?: string;
  address: string;
  lat: number;
  lng: number;
}

/** Result of a complete suggest → retrieve cycle — what features store/use. */
export interface PickedPlace {
  name: string;
  address: string;
  lat: number;
  lng: number;
}
