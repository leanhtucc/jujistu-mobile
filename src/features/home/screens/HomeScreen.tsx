import { createLogger } from '@jujistu/shared/logger/logger';
import {
  scaleResponsiveValue,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { primitiveColors } from '@jujistu/shared/theme';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHeroCarousel } from '../sections/HomeHeroCarousel';
import { HomeNewsSection } from '../sections/HomeNewsSection';
import { HomeQuickActions } from '../sections/HomeQuickActions';
import { ProductAccountHeader } from '../sections/ProductAccountHeader';

const backgroundImage = require('../../../../assets/image/backgrounds/bg_home.png');
const fallbackAvatar = require('../../../../assets/image/avatars/avatar_default.png');
const log = createLogger('HomeScreen');

export interface HomeScreenProps {
  readonly onReady?: () => void;
  readonly user: {
    readonly avatarUrl?: string | null;
    readonly displayName: string;
  };
}

export function HomeScreen({ onReady, user }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const [backgroundSettled, setBackgroundSettled] = useState(false);
  const [criticalContentSettled, setCriticalContentSettled] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);
  const quickActionsMarginTop = scaleResponsiveValue(92, responsive, {
    minScale: 0.76,
    maxScale: 1.1,
  });
  const avatar: ImageSourcePropType = user.avatarUrl
    ? { uri: user.avatarUrl }
    : fallbackAvatar;

  useEffect(() => {
    if (backgroundSettled && criticalContentSettled && hasLayout) {
      onReady?.();
    }
  }, [backgroundSettled, criticalContentSettled, hasLayout, onReady]);

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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.screen}
      >
        <HomeHeroCarousel
          onInitialImageSettled={() => setCriticalContentSettled(true)}
        />
        <View style={styles.newsSection}>
          <HomeNewsSection />
        </View>
        <View style={{ marginTop: quickActionsMarginTop }}>
          <HomeQuickActions />
        </View>
      </ScrollView>
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
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 15,
  },
  newsSection: {
    marginTop: 8,
  },
});
