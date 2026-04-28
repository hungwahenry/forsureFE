/**
 * Typed env reader for Expo's EXPO_PUBLIC_* variables.
 *
 * Anything prefixed EXPO_PUBLIC_* is inlined into the bundle at build time.
 * Validate at boot — easier to fix a missing env var than to debug a runtime
 * undefined.
 */

interface Env {
  apiUrl: string;
}

function required(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required env var ${key}. Set it in .env (Expo public env vars must be prefixed EXPO_PUBLIC_).`,
    );
  }
  return value;
}

export const env: Env = {
  apiUrl: required('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL),
};
