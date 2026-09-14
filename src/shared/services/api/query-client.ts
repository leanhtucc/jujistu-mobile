import { QueryClient } from '@tanstack/react-query';

/**
 * Create a QueryClient with React Native-optimized defaults.
 *
 * Key differences from web defaults:
 * - `refetchOnWindowFocus` is disabled because React Native does not have
 *   browser tab focus semantics. AppState-based refetching can be added later
 *   via `focusManager` if needed.
 * - `staleTime` is set to 5 minutes to reduce unnecessary refetches on slow
 *   mobile connections.
 * - `retry` is limited to 2 attempts for queries and disabled for mutations
 *   to prevent duplicate side effects.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
