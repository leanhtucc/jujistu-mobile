import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';
import { AppTag } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { AthleteProfile } from '../types/athlete.types';

export interface AthleteStatsSectionProps {
  readonly profile: AthleteProfile;
}

export function AthleteStatsSection({ profile }: AthleteStatsSectionProps) {
  return (
    <View style={styles.root} testID="athlete-stats">
      <View style={styles.stats}>
        {profile.stats.map(stat => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.medals}>
        {profile.medals.map(medal => (
          <View
            accessibilityLabel={`${medal.count} ${medal.label}`}
            accessible
            key={medal.label}
            style={styles.medal}
          >
            <AppTag label={medal.label} variant={medal.variant} />
            <Text style={styles.medalCount}>{medal.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 22 },
  stats: { flexDirection: 'row', gap: 6 },
  stat: { flex: 1 },
  statValue: {
    ...dsTypography.stat,
    color: semanticColors.text.primary,
    fontSize: 26,
    lineHeight: 28,
  },
  statLabel: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
  medals: { flexDirection: 'row', gap: 8 },
  medal: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.md + 4,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  medalCount: {
    ...dsTypography.stat,
    color: semanticColors.text.primary,
    fontSize: 22,
    lineHeight: 24,
  },
});
