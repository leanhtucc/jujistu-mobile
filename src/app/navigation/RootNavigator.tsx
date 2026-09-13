import { HomeScreen } from '@jujistu/features/home';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';

import { NavigationFallback } from './NavigationFallback';
import { ROOT_ROUTES } from './routes';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useAppTheme();
  const navigationTheme = theme.isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      fallback={<NavigationFallback />}
      theme={navigationTheme}
    >
      <Stack.Navigator
        initialRouteName={ROOT_ROUTES.HOME}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen component={HomeScreen} name={ROOT_ROUTES.HOME} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
