import type { UserProfile } from '@jujistu/features/auth';
import { HomeScreen } from '@jujistu/features/home';
import { primitiveColors } from '@jujistu/shared/theme';
import { AppBottomNavigation } from '@jujistu/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BOTTOM_NAVIGATION_ITEMS,
  type BottomNavigationProductKey,
} from './bottom-navigation-items';
import { MAIN_ROUTES } from './routes';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export interface MainNavigatorProps {
  readonly onReady?: () => void;
  readonly user: UserProfile;
}

function MainNavigationContent({ onReady, user }: MainNavigatorProps) {
  const insets = useSafeAreaInsets();
  const handleBottomNavigationPress = useCallback(
    (_key: BottomNavigationProductKey) => undefined,
    [],
  );

  return (
    <View style={styles.root}>
      <HomeScreen onReady={onReady} user={user} />
      <AppBottomNavigation
        activeKey="home"
        items={BOTTOM_NAVIGATION_ITEMS}
        onItemPress={handleBottomNavigationPress}
      />
      <View style={[styles.bottomInset, { height: insets.bottom }]} />
    </View>
  );
}

export function MainNavigator({ onReady, user }: MainNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName={MAIN_ROUTES.HOME}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={MAIN_ROUTES.HOME}>
        {() => <MainNavigationContent onReady={onReady} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: primitiveColors.neutral[1000],
  },
  bottomInset: {
    backgroundColor: primitiveColors.neutral[1000],
  },
});
