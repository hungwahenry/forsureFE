// EXPO_PUBLIC_* vars are inlined at build time. Validate at boot to fail fast on missing config.
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
