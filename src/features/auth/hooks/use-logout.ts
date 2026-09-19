import { tokenManager } from '@jujistu/shared/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { logout as logoutService } from '../services/auth-service';
import { authQueryKeys } from './auth-query-keys';

export interface UseLogoutResult {
  logout: () => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Public hook for logging out.
 * Ensures local credentials and auth cache are purged onSettled even if
 * server-side revocation fails.
 */
export function useLogout(): UseLogoutResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      try {
        await logoutService();
      } catch {
        // Even if server-side revocation fails, local credentials must be cleared
      }
    },
    onSettled: async () => {
      await tokenManager.clearTokens();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
  });

  const logout = useCallback(async () => {
    await mutation.mutateAsync();
  }, [mutation]);

  return {
    logout,
    isSubmitting: mutation.isPending,
  };
}
