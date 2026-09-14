import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenManager } from '@jujistu/shared/services/api';

import { authApi } from '../api/auth.api';
import type { AuthSession, LoginCredentials } from '../types/auth.types';
import { authKeys } from './auth.keys';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthSession, Error, LoginCredentials>({
    mutationFn: credentials => authApi.login(credentials),
    onSuccess: async session => {
      await tokenManager.saveTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      queryClient.setQueryData(authKeys.currentUser(), session.user);
    },
  });
}
