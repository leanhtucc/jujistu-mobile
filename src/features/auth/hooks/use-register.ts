import { tokenManager } from '@jujistu/shared/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { register as registerService } from '../services/auth-service';
import type { AuthSession, RegisterPayload } from '../types/auth.types';
import { authQueryKeys } from './auth-query-keys';

export interface UseRegisterResult {
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  isSubmitting: boolean;
  error: Error | null;
  clearError: () => void;
}

/**
 * Feature hook for user registration.
 * Saves tokens and seeds currentUser cache on success.
 */
export function useRegister(): UseRegisterResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<AuthSession, Error, RegisterPayload>({
    mutationFn: payload => registerService(payload),
    onSuccess: async session => {
      await tokenManager.saveTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      queryClient.setQueryData(authQueryKeys.currentUser(), session.user);
    },
  });

  const register = useCallback(
    async (payload: RegisterPayload) => {
      return mutation.mutateAsync(payload);
    },
    [mutation],
  );

  const clearError = useCallback(() => {
    mutation.reset();
  }, [mutation]);

  return {
    register,
    isSubmitting: mutation.isPending,
    error: mutation.error ?? null,
    clearError,
  };
}
