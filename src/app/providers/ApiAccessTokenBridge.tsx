import { authApi } from '@jujistu/features/auth';
import {
  refreshAccessToken,
  setApiAccessTokenProvider,
  setApiUnauthorizedHandler,
  tokenManager,
} from '@jujistu/shared/services/api';
import React, { type PropsWithChildren, useLayoutEffect } from 'react';

/**
 * Bridge connecting the runtime authentication session state to the shared HTTP client.
 *
 * It configures:
 * 1. An access token provider dynamically supplying the current JWT to requests.
 * 2. An unauthorized handler handling 401 token refresh with automatic request retry.
 */
export function ApiAccessTokenBridge({ children }: PropsWithChildren) {
  useLayoutEffect(() => {
    setApiAccessTokenProvider(async () => {
      const token = await tokenManager.getAccessToken();
      return token;
    });

    return () => {
      setApiAccessTokenProvider(null);
    };
  }, []);

  useLayoutEffect(() => {
    setApiUnauthorizedHandler(async () => {
      try {
        const newAccessToken = await refreshAccessToken(
          async refreshTokenValue => {
            const response = await authApi.refresh(refreshTokenValue);
            return {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            };
          },
        );

        return { retry: Boolean(newAccessToken) };
      } catch {
        return { retry: false };
      }
    });

    return () => {
      setApiUnauthorizedHandler(null);
    };
  }, []);

  return <>{children}</>;
}
