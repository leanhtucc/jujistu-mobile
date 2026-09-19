import { useAuthTransportBridge } from '@jujistu/features/auth';
import {
  refreshAccessToken,
  setApiAccessTokenProvider,
  setApiUnauthorizedHandler,
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
  const { getAccessToken, refreshSession } = useAuthTransportBridge();

  useLayoutEffect(() => {
    setApiAccessTokenProvider(getAccessToken);

    return () => {
      setApiAccessTokenProvider(null);
    };
  }, [getAccessToken]);

  useLayoutEffect(() => {
    setApiUnauthorizedHandler(async () => {
      try {
        const newAccessToken = await refreshAccessToken(
          async refreshTokenValue => {
            const response = await refreshSession(refreshTokenValue);
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
  }, [refreshSession]);

  return <>{children}</>;
}
