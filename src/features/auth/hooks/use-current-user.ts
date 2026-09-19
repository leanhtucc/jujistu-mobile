import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '../services/auth-service';
import type { UserProfile } from '../types/auth.types';
import { authQueryKeys } from './auth-query-keys';

export interface UseCurrentUserOptions {
  enabled?: boolean;
}

export interface UseCurrentUserResult {
  user: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

/**
 * Feature hook for querying the current authenticated user's profile.
 * Supports signal cancellation and private auth query keys.
 */
export function useCurrentUser(
  options?: UseCurrentUserOptions,
): UseCurrentUserResult {
  const query = useQuery<UserProfile, Error>({
    queryKey: authQueryKeys.currentUser(),
    queryFn: ({ signal }) => getCurrentUser({ signal }),
    enabled: options?.enabled,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isAuthenticated: Boolean(query.data),
    refetch: async () => {
      await query.refetch();
    },
  };
}
