import { useAuthState } from '@jujistu/features/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

import { AUTH_ROUTES, ROOT_ROUTES } from './routes';
import type { RootStackParamList } from './types';

export function useRequireAuth() {
  const { isAuthenticated, user } = useAuthState();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const requireAuth = useCallback(
    (action?: () => void) => {
      if (isAuthenticated && user) {
        action?.();
        return true;
      }

      navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN });
      return false;
    },
    [isAuthenticated, navigation, user],
  );

  return {
    isAuthenticated,
    requireAuth,
    user,
  };
}
