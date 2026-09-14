import { HomeScreen } from '@jujistu/features/home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { MAIN_ROUTES } from './routes';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={MAIN_ROUTES.HOME}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={HomeScreen} name={MAIN_ROUTES.HOME} />
    </Stack.Navigator>
  );
}
