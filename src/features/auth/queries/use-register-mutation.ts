import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenManager } from '@jujistu/shared/services/api';

import { authApi } from '../api/auth.api';
import type { AuthSession, RegisterPayload } from '../types/auth.types';
import { authKeys } from './auth.keys';

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthSession, Error, RegisterPayload>({
    mutationFn: payload => authApi.register(payload),
    onSuccess: async session => {
      await tokenManager.saveTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      queryClient.setQueryData(authKeys.currentUser(), session.user);
    },
  });
}
