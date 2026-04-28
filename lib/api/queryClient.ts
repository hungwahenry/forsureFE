import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './types';

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
      // RN doesn't have window focus, but keep it explicit.
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
