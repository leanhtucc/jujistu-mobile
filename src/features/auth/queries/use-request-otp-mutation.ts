import { useMutation } from '@tanstack/react-query';

import { authApi } from '../api/auth.api';
import type { OtpChallenge, RequestOtpPayload } from '../types/auth.types';

export function useRequestOtpMutation() {
  return useMutation<OtpChallenge, Error, RequestOtpPayload>({
    mutationFn: payload => authApi.requestOtp(payload),
  });
}
