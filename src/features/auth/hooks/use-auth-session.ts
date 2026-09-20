import { tokenManager } from '@jujistu/shared/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import type { AuthStatus, UserProfile } from '../types/auth.types';
import { authQueryKeys } from './auth-query-keys';
import { useCurrentUser } from './use-current-user';

export interface UseAuthSessionResult {
  isInitializing: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  authStatus: AuthStatus;
  clearSession: () => Promise<void>;
}

/**
 * Public hook coordinating the reactive authentication session lifecycle.
 * Preserves ADR-0009 readiness signals and provides clearSession action.
 */
export function useAuthSession(): UseAuthSessionResult {
  const queryClient = useQueryClient();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    let isMounted = true;

    tokenManager.getAccessToken().then(token => {
      if (isMounted) {
        setHasToken(Boolean(token));
        setTokenChecked(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const { user, isLoading, isError } = useCurrentUser({
    enabled: hasToken,
  });

  const isInitializing =
    !tokenChecked || (hasToken && isLoading && !user && !isError);
  const isAuthenticated = Boolean(user);

  const authStatus: AuthStatus = isInitializing
    ? { status: 'initializing' }
    : isAuthenticated && user
    ? { status: 'authenticated', user }
    : { status: 'guest' };

  const clearSession = useCallback(async () => {
    await tokenManager.clearTokens();
    queryClient.removeQueries({ queryKey: authQueryKeys.all });
    setHasToken(false);
  }, [queryClient]);

  return {
    isInitializing,
    isAuthenticated,
    user: user ?? null,
    authStatus,
    clearSession,
  };
}

/**
 * Backward-compatible alias for existing consumers.
 */
export const useAuthState = useAuthSession;
