import {
  selectResponsiveValue,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { createLogger } from '@jujistu/shared/logger/logger';
import { primitiveColors } from '@jujistu/shared/theme';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type {
  HomeEventItem,
  HomeMode,
  HomeNewsItem,
  HomeQuickAction,
  HomeVideoItem,
} from '../data/home-content';
import { GuestAccountHeader } from '../components/GuestAccountHeader';
import { HomeEventTicketSection } from '../components/HomeEventTicketSection';
import { HomeFeaturedVideoSection } from '../components/HomeFeaturedVideoSection';
import { HomeHeroCarousel } from '../components/HomeHeroCarousel';
import { HomeNewsSection } from '../components/HomeNewsSection';
import { HomeQuickActions } from '../components/HomeQuickActions';
import { ProductAccountHeader } from '../components/ProductAccountHeader';

const phoneBackgroundImage = require('../../../../assets/image/backgrounds/bg_home.png');
const tabletBackgroundImage = require('../../../../assets/image/backgrounds/bg_home_tablet.png');
const fallbackAvatar = require('../../../../assets/image/avatars/avatar_default.png');
const log = createLogger('HomeScreen');

export interface HomeScreenProps {
  readonly mode?: HomeMode;
  readonly onLogin?: () => void;
  readonly onPressAllNews?: () => void;
  readonly onPressAllVideos?: () => void;
  readonly onPressEvent?: (event: HomeEventItem) => void;
  readonly onPressNews?: (item: HomeNewsItem) => void;
  readonly onPressQuickAction?: (action: HomeQuickAction) => void;
  readonly onPressVideo?: (item: HomeVideoItem) => void;
  readonly onReady?: () => void;
  readonly user?: {
    readonly avatarUrl?: string | null;
    readonly displayName: string;
  } | null;
}

export function HomeScreen({
  mode,
  onLogin,
  onPressAllNews,
  onPressAllVideos,
  onPressEvent,
  onPressNews,
  onPressQuickAction,
  onPressVideo,
  onReady,
  user,
}: HomeScreenProps) {
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
  const avatar: ImageSourcePropType = user?.avatarUrl
    ? { uri: user.avatarUrl }
    : fallbackAvatar;
  const sectionSpacing = selectResponsiveValue(responsive, {
    compactPhone: { event: 16, hero: -12, news: 6, quick: 8, video: 12 },
    largePhone: { event: 20, hero: -8, news: 10, quick: 10, video: 16 },
    tablet: { event: 24, hero: 0, news: 14, quick: 14, video: 20 },
  });

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
        <View style={{ marginTop: sectionSpacing.hero }}>
          <HomeHeroCarousel
            onInitialImageSettled={() => setCriticalContentSettled(true)}
          />
        </View>
        <View style={{ marginTop: sectionSpacing.quick }}>
          <HomeQuickActions
            mode={effectiveMode}
            onPressAction={onPressQuickAction}
          />
        </View>
        <View style={{ marginTop: sectionSpacing.event }}>
          <HomeEventTicketSection onPressEvent={onPressEvent} />
        </View>
        <View style={{ marginTop: sectionSpacing.video }}>
          <HomeFeaturedVideoSection
            onPressAll={onPressAllVideos}
            onPressItem={onPressVideo}
          />
        </View>
        <View style={{ marginTop: sectionSpacing.news }}>
          <HomeNewsSection
            onPressAll={onPressAllNews}
            onPressItem={onPressNews}
          />
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
    backgroundColor: primitiveColors.neutral[1000],
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
});
