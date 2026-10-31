import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppBeltBar, AppCard, AppIcon } from '@jujistu/ui';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { SPOTLIGHT_PHOTO } from '../data/athlete-content';
import type { AthleteSummary } from '../types/athlete.types';

export interface AthleteSpotlightCardProps {
  readonly athlete: AthleteSummary;
  readonly teaser: string;
  readonly onPress?: (athlete: AthleteSummary) => void;
}

export function AthleteSpotlightCard({
  athlete,
  teaser,
  onPress,
}: AthleteSpotlightCardProps) {
  return (
    <Pressable
      accessibilityLabel={`VĐV nổi bật tuần: ${athlete.name}. ${teaser}. Xem hành trình`}
      accessibilityRole="button"
      onPress={() => onPress?.(athlete)}
      testID="athlete-spotlight"
    >
      <AppCard stitched style={styles.card} variant="elevated">
        <View style={styles.row}>
          <Image
            accessibilityIgnoresInvertColors
            source={SPOTLIGHT_PHOTO}
            style={styles.photo}
          />
          <View style={styles.body}>
            <Text style={styles.overline}>VĐV NỔI BẬT TUẦN</Text>
            <Text style={styles.name}>{athlete.name}</Text>
            <Text style={styles.teaser}>{teaser}</Text>
            <AppBeltBar
              belt={athlete.belt ?? 'brown'}
              degrees={2}
              height={12}
            />
            <View style={styles.cta}>
              <Text style={styles.ctaText}>XEM HÀNH TRÌNH</Text>
              <AppIcon
                accessible={false}
                color={semanticColors.text.accent}
                name="arrowRight"
                size={12}
              />
            </View>
          </View>
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 160 },
  row: { flexDirection: 'row', minHeight: 160 },
  photo: {
    backgroundColor: semanticColors.background.eventSurface,
    borderRightColor: semanticColors.border.subtle,
    borderRightWidth: 1,
    width: 118,
  },
  body: {
    flex: 1,
    gap: 8,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 22,
    paddingTop: 16,
  },
  overline: { ...dsTypography.overline, color: semanticColors.text.accent },
  name: { ...dsTypography.title, color: semanticColors.text.primary },
  teaser: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
  cta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 'auto',
  },
  ctaText: { ...dsTypography.overline, color: semanticColors.text.accent },
});
