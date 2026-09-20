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

import { GuestAccountHeader } from '../components/GuestAccountHeader';
import { HomeHeroCarousel } from '../components/HomeHeroCarousel';
import { HomeNewsSection } from '../components/HomeNewsSection';
import { HomeQuickActions } from '../components/HomeQuickActions';
import { ProductAccountHeader } from '../components/ProductAccountHeader';
import type { HomeMode } from '../data/home-content';

const phoneBackgroundImage = require('../../../../assets/image/backgrounds/bg_home.png');
const tabletBackgroundImage = require('../../../../assets/image/backgrounds/bg_home_tablet.png');
const fallbackAvatar = require('../../../../assets/image/avatars/avatar_default.png');
const log = createLogger('HomeScreen');

export interface HomeScreenProps {
  readonly mode?: HomeMode;
  readonly onLogin?: () => void;
  readonly onReady?: () => void;
  readonly user?: {
    readonly avatarUrl?: string | null;
    readonly displayName: string;
  } | null;
}

export function HomeScreen({ mode, onLogin, onReady, user }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const [backgroundSettled, setBackgroundSettled] = useState(false);
  const [criticalContentSettled, setCriticalContentSettled] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);
  const effectiveMode: HomeMode = mode ?? (user ? 'authenticated' : 'guest');
  const backgroundImage = responsive.isTablet
    ? tabletBackgroundImage
    : phoneBackgroundImage;
  const backgroundResizeMode =
    responsive.isTablet || responsive.isLandscape ? 'contain' : 'cover';
  const quickActionsMarginTop = responsive.isTablet
    ? scaleResponsiveValue(36, responsive, {
        minScale: 1,
        maxScale: 1.2,
      })
    : scaleResponsiveValue(92, responsive, {
        minScale: 0.76,
        maxScale: 1.1,
      });
  const avatar: ImageSourcePropType = user?.avatarUrl
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
        resizeMode={backgroundResizeMode}
        source={backgroundImage}
        style={styles.background}
      />

      <View style={[styles.topInset, { height: insets.top }]} />

      {effectiveMode === 'authenticated' && user ? (
        <ProductAccountHeader
          avatar={avatar}
          level="Level 22"
          primaryBalance="6253"
          secondaryBalance="8888"
          username={user.displayName}
        />
      ) : (
        <GuestAccountHeader onLogin={onLogin} />
      )}

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
          <HomeQuickActions mode={effectiveMode} />
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
    paddingBottom: 40,
  },
  newsSection: {
    marginTop: 8,
  },
});
