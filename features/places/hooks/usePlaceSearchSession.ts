import * as React from 'react';

/**
 * Generates a UUIDv4-format session token. Math.random is not
 * cryptographically secure, but session tokens just need to be
 * unique per user-search interaction for billing correlation —
 * not secrets.
 */
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Manages the session-token lifecycle for a place picker. The same token is
 * sent with every suggest call + the final retrieve so the provider
 * (Mapbox / Google) bills the whole interaction as one session unit.
 *
 * Call `renewSession` after a successful retrieve (or when the picker
 * closes) so the next interaction starts a fresh session.
 */
export function usePlaceSearchSession() {
  const [sessionToken, setSessionToken] = React.useState(uuidv4);

  const renewSession = React.useCallback(() => {
    setSessionToken(uuidv4());
  }, []);

  return { sessionToken, renewSession };
}
