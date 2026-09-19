import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { tokenManager } from '@jujistu/shared/services/api';

import { verifyOtp as verifyOtpService } from '../services/auth-service';
import type { AuthSession, VerifyOtpPayload } from '../types/auth.types';
import { authQueryKeys } from './auth-query-keys';

export interface UseVerifyOtpResult {
  verifyOtp: (payload: VerifyOtpPayload) => Promise<AuthSession>;
  isSubmitting: boolean;
  error: Error | null;
  clearError: () => void;
}

/**
 * Public hook for verifying an OTP challenge.
 * Manages token persistence and currentUser query cache seeding on success.
 */
export function useVerifyOtp(): UseVerifyOtpResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<AuthSession, Error, VerifyOtpPayload>({
    mutationFn: payload => verifyOtpService(payload),
    onSuccess: async session => {
      await tokenManager.saveTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      queryClient.setQueryData(authQueryKeys.currentUser(), session.user);
    },
  });

  const verifyOtp = useCallback(
    async (payload: VerifyOtpPayload) => {
      return mutation.mutateAsync(payload);
    },
    [mutation],
  );

  const clearError = useCallback(() => {
    mutation.reset();
  }, [mutation]);

  return {
    verifyOtp,
    isSubmitting: mutation.isPending,
    error: mutation.error ?? null,
    clearError,
  };
}
