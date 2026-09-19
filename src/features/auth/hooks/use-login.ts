import { tokenManager } from '@jujistu/shared/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { login as loginService } from '../services/auth-service';
import type { AuthSession, LoginCredentials } from '../types/auth.types';
import { authQueryKeys } from './auth-query-keys';

export interface UseLoginResult {
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  isSubmitting: boolean;
  error: Error | null;
  clearError: () => void;
}

/**
 * Feature hook for password authentication.
 * Saves tokens and seeds currentUser cache on success.
 */
export function useLogin(): UseLoginResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<AuthSession, Error, LoginCredentials>({
    mutationFn: credentials => loginService(credentials),
    onSuccess: async session => {
      await tokenManager.saveTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      queryClient.setQueryData(authQueryKeys.currentUser(), session.user);
    },
  });

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return mutation.mutateAsync(credentials);
    },
    [mutation],
  );

  const clearError = useCallback(() => {
    mutation.reset();
  }, [mutation]);

  return {
    login,
    isSubmitting: mutation.isPending,
    error: mutation.error ?? null,
    clearError,
  };
}
