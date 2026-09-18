import { primitiveColors, radius } from '@jujistu/shared/theme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { HOME_BANNERS } from '../home-content';

const PAGINATION_DOTS = 5;

export function HomeHeroCarousel() {
  return (
    <View
      accessibilityLabel="Banner sự kiện nổi bật"
      accessible
      style={styles.viewport}
    >
      <View style={styles.rail}>
        <View style={styles.sideBanner}>
          <Image
            source={HOME_BANNERS.previous}
            resizeMode="cover"
            style={styles.image}
          />
          <View style={[styles.overlay, styles.previousOverlay]} />
        </View>

        <Image
          source={HOME_BANNERS.active}
          resizeMode="cover"
          style={styles.activeBanner}
        />

        <View style={styles.sideBanner}>
          <Image
            source={HOME_BANNERS.next}
            resizeMode="cover"
            style={styles.image}
          />
          <View style={[styles.overlay, styles.nextOverlay]} />
        </View>
      </View>

      <View accessibilityElementsHidden style={styles.pagination}>
        {Array.from({ length: PAGINATION_DOTS }, (_, index) => (
          <View
            key={index}
            style={[styles.dot, index === 0 ? styles.activeDot : undefined]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    width: '100%',
    height: 174.0625,
    alignItems: 'center',
    overflow: 'hidden',
  },
  rail: {
    width: 741,
    height: 158.0625,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sideBanner: {
    width: 222,
    height: 125,
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
  activeBanner: {
    width: 281,
    height: 158.0625,
    borderRadius: radius.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: primitiveColors.neutral[1000],
  },
  previousOverlay: {
    opacity: 0.4,
  },
  nextOverlay: {
    opacity: 0.2,
  },
  pagination: {
    height: 4,
    marginTop: 12,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: primitiveColors.neutral[300],
  },
  activeDot: {
    backgroundColor: primitiveColors.red[500],
  },
});
