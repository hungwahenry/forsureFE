import * as React from 'react';

// Math.random is fine here — session tokens correlate billing, not secrets.
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// One token spans every suggest + the final retrieve so the provider bills as a single session.
export function usePlaceSearchSession() {
  const [sessionToken, setSessionToken] = React.useState(uuidv4);

  const renewSession = React.useCallback(() => {
    setSessionToken(uuidv4());
  }, []);

  return { sessionToken, renewSession };
}
