import { tokenManager } from '@jujistu/shared/services/api';
import { useEffect, useState } from 'react';

import { useCurrentUserQuery } from './use-current-user-query';

const MINIMUM_INITIALIZE_DURATION_MS = 2500;

export function useAuthState() {
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const minDelayPromise = new Promise<void>(resolve =>
      setTimeout(() => resolve(), MINIMUM_INITIALIZE_DURATION_MS),
    );

    Promise.all([tokenManager.getAccessToken(), minDelayPromise]).then(
      ([token]) => {
        if (isMounted) {
          setHasToken(Boolean(token));
          setTokenChecked(true);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    data: user,
    isLoading,
    isError,
  } = useCurrentUserQuery({
    enabled: hasToken,
  });

  const isInitializing =
    !tokenChecked || (hasToken && isLoading && !user && !isError);
  const isAuthenticated = Boolean(user);

  return {
    isInitializing,
    isAuthenticated,
    user: user ?? null,
  };
}
