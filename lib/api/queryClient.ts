import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, type AppStateStatus } from 'react-native';
import { ApiError } from './types';

// React Native equivalent of "window focus": app foreground/background. Without
// this, refetchOnWindowFocus is a no-op on mobile. Run once at module load.
focusManager.setEventListener((handleFocus) => {
  const sub = AppState.addEventListener('change', (status: AppStateStatus) => {
    handleFocus(status === 'active');
  });
  return () => sub.remove();
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry 4xx — those are deterministic. Retry 5xx and network errors twice.
      retry: (count, error) => {
        if (error instanceof ApiError && error.httpStatus !== null) {
          return error.httpStatus >= 500 && count < 2;
        }
        return count < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
});
