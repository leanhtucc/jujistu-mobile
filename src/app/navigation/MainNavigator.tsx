import type { UserProfile } from '@jujistu/features/auth';
import { HomeScreen } from '@jujistu/features/home';
import {
  VideoLibraryScreen,
  VideoPlayerScreen,
} from '@jujistu/features/videos';
import { primitiveColors } from '@jujistu/shared/theme';
import { AppBottomNavigation } from '@jujistu/ui';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BOTTOM_NAVIGATION_ITEMS,
  type BottomNavigationProductKey,
} from './bottom-navigation-items';
import { AUTH_ROUTES, MAIN_ROUTES, ROOT_ROUTES } from './routes';
import type { MainStackParamList, RootStackParamList } from './types';
import { useRequireAuth } from './use-require-auth';

const Stack = createNativeStackNavigator<MainStackParamList>();

export interface MainNavigatorProps {
  readonly onLogin?: () => void;
  readonly onReady?: () => void;
  readonly user?: UserProfile | null;
}

function MainNavigationContent({ onLogin, onReady, user }: MainNavigatorProps) {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { requireAuth } = useRequireAuth();
  const mainNavigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleLogin = useCallback(() => {
    if (onLogin) {
      onLogin();
    } else {
      navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN });
    }
  }, [navigation, onLogin]);

  const handleBottomNavigationPress = useCallback(
    (key: BottomNavigationProductKey) => {
      if (key !== 'home') {
        requireAuth();
      }
    },
    [requireAuth],
  );

  return (
    <View style={styles.root}>
      <HomeScreen
        onLogin={handleLogin}
        onPressAllVideos={() => mainNavigation.navigate(MAIN_ROUTES.VIDEOS)}
        onPressVideo={video =>
          mainNavigation.navigate(MAIN_ROUTES.VIDEO_PLAYER, {
            videoId: video.id,
          })
        }
        onReady={onReady}
        user={user}
      />
      <AppBottomNavigation
        activeKey="home"
        items={BOTTOM_NAVIGATION_ITEMS}
        onItemPress={handleBottomNavigationPress}
      />
      <View style={[styles.bottomInset, { height: insets.bottom }]} />
    </View>
  );
}

export function MainNavigator({ onLogin, onReady, user }: MainNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName={MAIN_ROUTES.HOME}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={MAIN_ROUTES.HOME}>
        {() => (
          <MainNavigationContent
            onLogin={onLogin}
            onReady={onReady}
            user={user}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.VIDEOS}>
        {({ navigation }) => (
          <VideoLibraryScreen
            onBack={() => navigation.goBack()}
            onSelectVideo={videoId =>
              navigation.navigate(MAIN_ROUTES.VIDEO_PLAYER, { videoId })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.VIDEO_PLAYER}>
        {({ navigation, route }) => (
          <VideoPlayerScreen
            onBack={() => navigation.goBack()}
            videoId={route.params.videoId}
          />
        )}
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
