import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenManager } from '@jujistu/shared/services/api';

import { authApi } from '../api/auth.api';
import { authKeys } from './auth.keys';

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        // Even if server-side revocation fails, local credentials must be cleared
      }
    },
    onSettled: async () => {
      await tokenManager.clearTokens();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
