import * as Sentry from '@sentry/react-native';

// Crash/error reporting. No-op when EXPO_PUBLIC_SENTRY_DSN is unset, so the
// app runs fine locally and in builds without a Sentry project configured.
const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: __DEV__ ? 1 : 0.2,
  });
}

export { Sentry };
