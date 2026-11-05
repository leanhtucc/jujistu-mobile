import {
  selectResponsiveValue,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { primitiveColors } from '@jujistu/shared/theme';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type {
  HomeAthleteSpotlight,
  HomeHeroSlide,
  HomeMode,
  HomeNewsItem,
  HomeProductHighlight,
  HomeShortcut,
  HomeUpcomingTournament,
  HomeVideoItem,
  TicketSession,
} from '../data/home-content';
import { GuestAccountHeader } from '../components/GuestAccountHeader';
import { HomeAthleteSpotlightCard } from '../components/HomeAthleteSpotlightCard';
import { HomeEmberGlowBackground } from '../components/HomeEmberGlowBackground';

const phoneBackgroundImage = require('../../../../assets/image/backgrounds/bg_home.png');
const tabletBackgroundImage = require('../../../../assets/image/backgrounds/bg_home_tablet.png');
import { HomeEventTicketSection } from '../components/HomeEventTicketSection';
import { HomeFeaturedVideoSection } from '../components/HomeFeaturedVideoSection';
import { HomeHeader } from '../components/HomeHeader';
import { HomeHeroCarousel } from '../components/HomeHeroCarousel';
import { HomeNewsSection } from '../components/HomeNewsSection';
import { HomeProductsSection } from '../components/HomeProductsSection';
import { HomeQuickActions } from '../components/HomeQuickActions';
import { HomeRecentRecapCard } from '../components/HomeRecentRecapCard';
import { HomeUpcomingTournamentCard } from '../components/HomeUpcomingTournamentCard';

export interface HomeScreenProps {
  readonly coinBalance?: number;
  readonly hasUnreadNotifications?: boolean;
  readonly mode?: HomeMode;
  readonly onLogin?: () => void;
  readonly onPressAllNews?: () => void;
  readonly onPressAllVideos?: () => void;
  readonly onPressAthlete?: (name: string) => void;
  readonly onPressAthleteJourney?: (athlete: HomeAthleteSpotlight) => void;
  readonly onPressChooseSeat?: (session: TicketSession) => void;
  readonly onPressCoins?: () => void;
  readonly onPressHeroSlide?: (slide: HomeHeroSlide) => void;
  readonly onPressLive?: () => void;
  readonly onPressNews?: (item: HomeNewsItem) => void;
  readonly onPressNotifications?: () => void;
  readonly onPressProduct?: (product: HomeProductHighlight) => void;
  readonly onPressResults?: () => void;
  readonly onPressSchedule?: () => void;
  readonly onPressShop?: () => void;
  readonly onPressShortcut?: (shortcut: HomeShortcut) => void;
  readonly onPressTickets?: () => void;
  readonly onPressTournament?: (tournament: HomeUpcomingTournament) => void;
  readonly onPressVideo?: (item: HomeVideoItem) => void;
  readonly onReady?: () => void;
  readonly onToggleRemind?: (reminded: boolean) => void;
  readonly user?: {
    readonly avatarUrl?: string | null;
    readonly displayName: string;
  } | null;
}

export function HomeScreen({
  coinBalance = 12500,
  hasUnreadNotifications,
  mode: _mode,
  onLogin,
  onPressAllNews,
  onPressAllVideos,
  onPressAthlete,
  onPressAthleteJourney,
  onPressChooseSeat,
  onPressCoins,
  onPressHeroSlide,
  onPressLive: _onPressLive,
  onPressNews,
  onPressNotifications,
  onPressProduct,
  onPressResults,
  onPressSchedule,
  onPressShop,
  onPressShortcut,
  onPressTickets,
  onPressTournament,
  onPressVideo,
  onReady,
  onToggleRemind,
  user,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const isGuest = user === null;
  const backgroundImage =
    responsive.isTablet || responsive.isLandscape
      ? tabletBackgroundImage
      : phoneBackgroundImage;
  const backgroundResizeMode =
    responsive.isTablet || responsive.isLandscape ? 'contain' : 'cover';
  const [backgroundSettled, setBackgroundSettled] = useState(false);
  const [criticalContentSettled, setCriticalContentSettled] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);

  const sectionSpacing = selectResponsiveValue(responsive, {
    compactPhone: {
      quick: 12,
      card: 16,
      section: 20,
    },
    largePhone: {
      quick: 16,
      card: 18,
      section: 24,
    },
    tablet: {
      quick: 20,
      card: 22,
      section: 28,
    },
  });

  useEffect(() => {
    if (backgroundSettled && criticalContentSettled && hasLayout) {
      onReady?.();
    }
  }, [backgroundSettled, criticalContentSettled, hasLayout, onReady]);

  const handleShortcutPress = useCallback(
    (shortcut: HomeShortcut) => {
      // A generic shortcut handler owns navigation; calling the specific
      // handlers as well would push the destination twice.
      if (onPressShortcut) {
        onPressShortcut(shortcut);
        return;
      }
      if (shortcut.key === 'tournaments') onPressSchedule?.();
      else if (shortcut.key === 'results') onPressResults?.();
      else if (shortcut.key === 'tickets') onPressTickets?.();
      else if (shortcut.key === 'videos') onPressAllVideos?.();
    },
    [
      onPressAllVideos,
      onPressResults,
      onPressSchedule,
      onPressShortcut,
      onPressTickets,
    ],
  );

  return (
    <View onLayout={() => setHasLayout(true)} style={styles.root}>
      {/* Background container: Ember Glow over deep dark canvas */}
      <HomeEmberGlowBackground />
      <Image
        accessibilityIgnoresInvertColors
        accessible={false}
        onError={() => setBackgroundSettled(true)}
        onLoad={() => setBackgroundSettled(true)}
        resizeMode={backgroundResizeMode}
        source={backgroundImage}
        style={styles.hiddenBackground}
      />
      {/* Main Scroll Content matching Prototype */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top, 12) },
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.screen}
      >
        {/* Top Header matching prototype or Guest Header if user is null */}
        {isGuest ? (
          <GuestAccountHeader onLogin={onLogin} />
        ) : (
          <HomeHeader
            coinBalance={coinBalance}
            hasUnreadNotifications={hasUnreadNotifications}
            onOpenCoins={onPressCoins}
            onOpenNotifications={onPressNotifications}
            userName={user?.displayName ?? 'Minh'}
          />
        )}

        {/* 1. Quick Actions Shortcuts */}
        <View style={{ marginTop: sectionSpacing.quick }}>
          <HomeQuickActions onPressAction={handleShortcutPress} />
        </View>

        {/* 2. Upcoming Tournament Countdown Card */}
        <View style={{ marginTop: sectionSpacing.card }}>
          <HomeUpcomingTournamentCard
            onPressTournament={onPressTournament ?? onPressSchedule}
            onToggleRemind={onToggleRemind}
          />
        </View>

        {/* 3. Recent Tournament Recap Card */}
        <View style={{ marginTop: sectionSpacing.card }}>
          <HomeRecentRecapCard onPressResults={onPressResults} />
        </View>

        {/* 4. Hero Banner Carousel */}
        <View style={{ marginTop: sectionSpacing.card }}>
          <HomeHeroCarousel
            onInitialImageSettled={() => setCriticalContentSettled(true)}
            onPressSlide={onPressHeroSlide}
          />
        </View>

        {/* 5. Tickets Section (Voucher Style) */}
        <View style={{ marginTop: sectionSpacing.section }}>
          <HomeEventTicketSection
            onPressChooseSeat={
              onPressChooseSeat ?? (_sess => onPressTickets?.())
            }
            onPressEvent={_ev => onPressTickets?.()}
          />
        </View>

        {/* 6. Featured Replay & Highlight Videos */}
        <View style={{ marginTop: sectionSpacing.section }}>
          <HomeFeaturedVideoSection
            onPressAll={onPressAllVideos}
            onPressItem={onPressVideo}
          />
        </View>

        {/* 7. Athlete Journey Spotlight */}
        <View style={{ marginTop: sectionSpacing.section }}>
          <HomeAthleteSpotlightCard
            onPressJourney={ath => {
              onPressAthleteJourney?.(ath);
              onPressAthlete?.(ath.name);
            }}
          />
        </View>

        {/* 8. Products from Shop */}
        <View style={{ marginTop: sectionSpacing.section }}>
          <HomeProductsSection
            onOpenShop={onPressShop}
            onSelectProduct={onPressProduct}
          />
        </View>

        {/* 9. News & Results Section */}
        <View style={{ marginTop: sectionSpacing.section }}>
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
    backgroundColor: primitiveColors.neutral[900],
  },
  topInset: {
    backgroundColor: 'transparent',
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
  },
  hiddenBackground: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
