import { primitiveColors } from '@jujistu/shared/theme';
import { AppBeltBar, AppIcon, AppPressable } from '@jujistu/ui';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import {
  HOME_ATHLETE_SPOTLIGHT,
  type HomeAthleteSpotlight,
} from '../data/home-content';

export interface HomeAthleteSpotlightCardProps {
  readonly spotlight?: HomeAthleteSpotlight;
  readonly onPressJourney?: (athlete: HomeAthleteSpotlight) => void;
}

export function HomeAthleteSpotlightCard({
  spotlight = HOME_ATHLETE_SPOTLIGHT,
  onPressJourney,
}: HomeAthleteSpotlightCardProps) {
  return (
    <View style={styles.root}>
      <AppPressable
        accessibilityLabel={`Hành trình VĐV ${spotlight.name}`}
        accessibilityRole="button"
        onPress={() => onPressJourney?.(spotlight)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {/* Left Column: Athlete Photo */}
        <View style={styles.photoCol}>
          <Image
            resizeMode="cover"
            source={spotlight.image}
            style={styles.photoImage}
          />
        </View>

        {/* Right Column: Info, BeltBar, Action */}
        <View style={styles.infoCol}>
          <View style={styles.titles}>
            <Text style={styles.overline}>{spotlight.overline}</Text>
            <Text numberOfLines={1} style={styles.name}>
              {spotlight.name}
            </Text>
            <Text numberOfLines={1} style={styles.career}>
              {spotlight.career}
            </Text>
          </View>

          {/* Authentic BJJ Belt Graphic */}
          <View style={styles.beltContainer}>
            <AppBeltBar
              belt={spotlight.belt}
              degrees={spotlight.degrees}
              height={12}
            />
          </View>

          {/* Action link */}
          <View style={styles.actionRow}>
            <Text style={styles.actionText}>XEM HÀNH TRÌNH</Text>
            <AppIcon
              color={primitiveColors.orange[500]}
              name="arrowRight"
              size={12}
            />
          </View>
        </View>
      </AppPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    height: 160,
    borderRadius: 18,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
    backgroundColor: primitiveColors.neutral[800],
  },
  photoCol: {
    width: 118,
    height: 160,
    borderRightWidth: 1,
    borderRightColor: primitiveColors.alpha.white10,
    backgroundColor: primitiveColors.neutral[900],
    overflow: 'hidden',
  },
  photoImage: {
    width: 118,
    height: 160,
  },
  infoCol: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  titles: {
    gap: 4,
  },
  overline: {
    color: primitiveColors.orange[500],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  name: {
    color: primitiveColors.neutral[0],
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 21,
  },
  career: {
    color: primitiveColors.neutral[300],
    fontSize: 12,
    fontWeight: '500',
  },
  beltContainer: {
    width: '100%',
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
  },
  actionText: {
    color: primitiveColors.orange[500],
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
