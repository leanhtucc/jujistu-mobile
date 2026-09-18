import type { UserProfile } from '@jujistu/features/auth';
import { HomeScreen } from '@jujistu/features/home';
import { createLogger } from '@jujistu/shared/logger/logger';
import { primitiveColors } from '@jujistu/shared/theme';
import { AppBottomNavigation } from '@jujistu/ui';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductAccountHeader } from '../components';
import {
  BOTTOM_NAVIGATION_ITEMS,
  type BottomNavigationProductKey,
} from '../navigation/bottom-navigation-items';

const backgroundImage = require('../../../assets/image/backgrounds/bg_home.png');
const fallbackAvatar = require('../../../assets/app/LogoApp.png');
const log = createLogger('HomeRouteScreen');

export interface HomeRouteScreenProps {
  readonly onReady?: () => void;
  readonly user: UserProfile;
}

export function HomeRouteScreen({ onReady, user }: HomeRouteScreenProps) {
  const insets = useSafeAreaInsets();
  const [backgroundSettled, setBackgroundSettled] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);
  const avatar: ImageSourcePropType = user.avatarUrl
    ? { uri: user.avatarUrl }
    : fallbackAvatar;
  const handleBottomNavigationPress = useCallback(
    (_key: BottomNavigationProductKey) => undefined,
    [],
  );

  useEffect(() => {
    if (backgroundSettled && hasLayout) {
      onReady?.();
    }
  }, [backgroundSettled, hasLayout, onReady]);

  const handleBackgroundError = useCallback(() => {
    log.error('Home background failed to load');
    setBackgroundSettled(true);
  }, []);

  return (
    <View onLayout={() => setHasLayout(true)} style={styles.root}>
      <Image
        accessible={false}
        fadeDuration={0}
        importantForAccessibility="no"
        onError={handleBackgroundError}
        onLoad={() => setBackgroundSettled(true)}
        resizeMode="cover"
        source={backgroundImage}
        style={styles.background}
      />

      <View style={[styles.topInset, { height: insets.top }]} />

      <ProductAccountHeader
        avatar={avatar}
        level="Level 22"
        primaryBalance="6253"
        secondaryBalance="8888"
        username={user.displayName}
      />

      <HomeScreen />

      <AppBottomNavigation
        activeKey="home"
        items={BOTTOM_NAVIGATION_ITEMS}
        onItemPress={handleBottomNavigationPress}
      />
      <View style={[styles.bottomInset, { height: insets.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: primitiveColors.neutral[1000],
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  topInset: {
    backgroundColor: '#030003',
  },
  bottomInset: {
    backgroundColor: primitiveColors.neutral[1000],
  },
});
