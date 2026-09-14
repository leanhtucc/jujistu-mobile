import { useAuthState } from '@jujistu/features/auth';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';
import React from 'react';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { NavigationFallback } from './NavigationFallback';
import { ROOT_ROUTES } from './routes';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useAppTheme();
  const navigationTheme = theme.isDark ? DarkTheme : DefaultTheme;
  const { isInitializing, isAuthenticated } = useAuthState();

  if (isInitializing) {
    return <NavigationFallback />;
  }

  return (
    <NavigationContainer
      fallback={<NavigationFallback />}
      theme={navigationTheme}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen component={MainNavigator} name={ROOT_ROUTES.MAIN} />
        ) : (
          <Stack.Screen component={AuthNavigator} name={ROOT_ROUTES.AUTH} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
