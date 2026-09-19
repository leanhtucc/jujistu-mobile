import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

import { requestOtp as requestOtpService } from '../services/auth-service';
import type { OtpChallenge, RequestOtpPayload } from '../types/auth.types';

export interface UseRequestOtpResult {
  requestOtp: (payload: RequestOtpPayload) => Promise<OtpChallenge>;
  isSubmitting: boolean;
  error: Error | null;
  clearError: () => void;
}

/**
 * Public hook for initiating an email OTP challenge.
 * Exposes a semantic action contract; encapsulates TanStack Query internals.
 */
export function useRequestOtp(): UseRequestOtpResult {
  const mutation = useMutation<OtpChallenge, Error, RequestOtpPayload>({
    mutationFn: payload => requestOtpService(payload),
  });

  const requestOtp = useCallback(
    async (payload: RequestOtpPayload) => {
      return mutation.mutateAsync(payload);
    },
    [mutation],
  );

  const clearError = useCallback(() => {
    mutation.reset();
  }, [mutation]);

  return {
    requestOtp,
    isSubmitting: mutation.isPending,
    error: mutation.error ?? null,
    clearError,
  };
}
