import {
  AuthBackground,
  LoginScreen,
  OtpScreen,
  WelcomeScreen,
} from '@jujistu/features/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AUTH_ROUTES } from './routes';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export interface AuthNavigatorProps {
  readonly onReady?: () => void;
}

export function AuthNavigator({ onReady }: AuthNavigatorProps) {
  return (
    <AuthBackground onReady={onReady}>
      <Stack.Navigator
        initialRouteName={AUTH_ROUTES.LOGIN}
        screenOptions={{
          contentStyle: { backgroundColor: 'transparent' },
          headerShown: false,
        }}
      >
        <Stack.Screen name={AUTH_ROUTES.WELCOME}>
          {({ navigation }) => (
            <WelcomeScreen
              onLogin={() => navigation.navigate(AUTH_ROUTES.LOGIN)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={AUTH_ROUTES.LOGIN}>
          {({ navigation }) => (
            <LoginScreen
              onBack={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.getParent()?.goBack();
                }
              }}
              onOtpRequested={params =>
                navigation.navigate(AUTH_ROUTES.OTP, params)
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={AUTH_ROUTES.OTP}
          options={{
            animation: 'fade',
            presentation: 'transparentModal',
          }}
        >
          {({ navigation, route }) => (
            <OtpScreen
              challengeId={route.params.challengeId}
              email={route.params.email}
              onClose={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </AuthBackground>
  );
}
