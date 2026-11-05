import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppBeltBar } from '@jujistu/ui';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { AthleteProfile, AthleteSummary } from '../types/athlete.types';

export const ATHLETE_HERO_HEIGHT = 372;

export interface AthleteProfileHeroProps {
  readonly athlete: AthleteSummary;
  readonly profile: AthleteProfile;
}

export function AthleteProfileHero({
  athlete,
  profile,
}: AthleteProfileHeroProps) {
  return (
    <View style={styles.root} testID="athlete-hero">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={profile.photo}
        style={StyleSheet.absoluteFill}
      />
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="athlete-hero-scrim" x1="0" x2="0" y1="0" y2="1">
            <Stop
              offset="0.3"
              stopColor={semanticColors.background.canvas}
              stopOpacity="0"
            />
            <Stop
              offset="0.7"
              stopColor={semanticColors.background.canvas}
              stopOpacity="0.72"
            />
            <Stop
              offset="1"
              stopColor={semanticColors.background.canvas}
              stopOpacity="1"
            />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#athlete-hero-scrim)" height="100%" width="100%" />
      </Svg>
      <View style={styles.info}>
        <Text style={styles.overline}>{profile.overline}</Text>
        <Text accessibilityRole="header" style={styles.name}>
          {athlete.name}
        </Text>
        <Text style={styles.subtitle}>{profile.subtitle}</Text>
        <View style={styles.beltRow}>
          <AppBeltBar
            belt={profile.belt}
            degrees={profile.beltDegrees}
            height={14}
            width={150}
          />
          <Text style={styles.beltLabel}>{profile.beltLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semanticColors.background.eventSurface,
    height: ATHLETE_HERO_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  info: { gap: 8, paddingBottom: 18, paddingHorizontal: 20 },
  overline: { ...dsTypography.overline, color: semanticColors.text.accent },
  name: { ...dsTypography.display, color: semanticColors.text.primary },
  subtitle: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
  beltRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  beltLabel: { ...dsTypography.overline, color: semanticColors.text.tertiary },
});
