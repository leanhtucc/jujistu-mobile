import type { UserProfile } from '@jujistu/features/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { HomeRouteScreen } from '../screens/HomeRouteScreen';
import { MAIN_ROUTES } from './routes';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export interface MainNavigatorProps {
  readonly user: UserProfile;
}

export function MainNavigator({ user }: MainNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName={MAIN_ROUTES.HOME}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={MAIN_ROUTES.HOME}>
        {() => <HomeRouteScreen user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
