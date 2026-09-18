import { tokenManager } from '@jujistu/shared/services/api';
import { useEffect, useState } from 'react';

import { useCurrentUserQuery } from './use-current-user-query';

export function useAuthState() {
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
