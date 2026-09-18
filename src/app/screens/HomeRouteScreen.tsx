import type { UserProfile } from '@jujistu/features/auth';
import { HomeScreen } from '@jujistu/features/home';
import { primitiveColors } from '@jujistu/shared/theme';
import { AppBottomNavigation } from '@jujistu/ui';
import React, { useCallback } from 'react';
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

export interface HomeRouteScreenProps {
  readonly user: UserProfile;
}

export function HomeRouteScreen({ user }: HomeRouteScreenProps) {
  const insets = useSafeAreaInsets();
  const avatar: ImageSourcePropType = user.avatarUrl
    ? { uri: user.avatarUrl }
    : fallbackAvatar;
  const handleBottomNavigationPress = useCallback(
    (_key: BottomNavigationProductKey) => undefined,
    [],
  );

  return (
    <View style={styles.root}>
      <Image
        accessible={false}
        importantForAccessibility="no"
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
