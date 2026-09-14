import { LoginScreen, RegisterScreen } from '@jujistu/features/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AUTH_ROUTES } from './routes';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={AUTH_ROUTES.LOGIN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={LoginScreen} name={AUTH_ROUTES.LOGIN} />
      <Stack.Screen component={RegisterScreen} name={AUTH_ROUTES.REGISTER} />
    </Stack.Navigator>
  );
}
