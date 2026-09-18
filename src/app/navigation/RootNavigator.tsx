import { useAuthState } from '@jujistu/features/auth';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { NavigationFallback } from './NavigationFallback';
import { ROOT_ROUTES } from './routes';
import type { RootStackParamList } from './types';

export const MIN_LOADING_VISIBLE_MS = 4000;

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#000000',
  },
};

export function RootNavigator() {
  const { isInitializing, isAuthenticated, user } = useAuthState();
  const [loadingReady, setLoadingReady] = useState(false);
  const [minimumVisibleElapsed, setMinimumVisibleElapsed] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);
  const [destinationReady, setDestinationReady] = useState(false);
  const [startupComplete, setStartupComplete] = useState(false);
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const transitionStartedRef = useRef(false);

  const handleLoadingReady = useCallback(() => setLoadingReady(true), []);
  const handleNavigationReady = useCallback(() => setNavigationReady(true), []);
  const handleDestinationReady = useCallback(
    () => setDestinationReady(true),
    [],
  );

  useEffect(() => {
    if (!loadingReady) {
      return;
    }

    const timer = setTimeout(() => {
      setMinimumVisibleElapsed(true);
    }, MIN_LOADING_VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [loadingReady]);

  useEffect(() => {
    const canTransition =
      !startupComplete &&
      !isInitializing &&
      loadingReady &&
      minimumVisibleElapsed &&
      navigationReady &&
      destinationReady;

    if (!canTransition || transitionStartedRef.current) {
      return;
    }

    transitionStartedRef.current = true;

    const transition = Animated.timing(loadingOpacity, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
      toValue: 0,
      useNativeDriver: true,
    });

    transition.start(({ finished }) => {
      if (finished) {
        setStartupComplete(true);
      } else {
        transitionStartedRef.current = false;
      }
    });

    return () => transition.stop();
  }, [
    destinationReady,
    isInitializing,
    loadingOpacity,
    loadingReady,
    minimumVisibleElapsed,
    navigationReady,
    startupComplete,
  ]);

  return (
    <View style={styles.root}>
      {!isInitializing ? (
        <NavigationContainer
          fallback={<View style={styles.root} />}
          onReady={handleNavigationReady}
          theme={navigationTheme}
        >
          <Stack.Navigator
            screenOptions={{
              contentStyle: styles.root,
              headerShown: false,
            }}
          >
            {isAuthenticated && user ? (
              <Stack.Screen name={ROOT_ROUTES.MAIN}>
                {() => (
                  <MainNavigator onReady={handleDestinationReady} user={user} />
                )}
              </Stack.Screen>
            ) : (
              <Stack.Screen name={ROOT_ROUTES.AUTH}>
                {() => <AuthNavigator onReady={handleDestinationReady} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      ) : null}

      {!startupComplete ? (
        <Animated.View
          style={[styles.loadingOverlay, { opacity: loadingOpacity }]}
        >
          <NavigationFallback
            duration={MIN_LOADING_VISIBLE_MS}
            onReady={handleLoadingReady}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    backgroundColor: '#000000',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  root: {
    backgroundColor: '#000000',
    flex: 1,
  },
});
