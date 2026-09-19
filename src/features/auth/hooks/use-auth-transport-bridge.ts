import { tokenManager } from '@jujistu/shared/services/api';
import { useCallback } from 'react';

import { refreshSession } from '../services/auth-service';
import type { TokenResponse } from '../types/auth.types';

export interface UseAuthTransportBridgeResult {
  getAccessToken: () => Promise<string | null | undefined>;
  refreshSession: (refreshToken: string) => Promise<TokenResponse>;
}

/**
 * Bridge hook providing stable callbacks for the shared HTTP transport infrastructure.
 * Conforms strictly to React Rules of Hooks by creating callbacks during component render.
 */
export function useAuthTransportBridge(): UseAuthTransportBridgeResult {
  const getAccessToken = useCallback(async () => {
    return tokenManager.getAccessToken();
  }, []);

  const refreshSessionCallback = useCallback(async (refreshToken: string) => {
    return refreshSession(refreshToken);
  }, []);

  return {
    getAccessToken,
    refreshSession: refreshSessionCallback,
  };
}
