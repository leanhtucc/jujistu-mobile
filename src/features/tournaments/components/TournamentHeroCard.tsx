import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';
import { AppEmberGlow, AppTag } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Tournament, TournamentStatus } from '../types/tournament.types';
import { TournamentStatusLabel } from './TournamentStatusLabel';

export interface TournamentHeroCardProps {
  readonly tournament: Tournament;
  readonly status: TournamentStatus;
  readonly statusLabel: string;
  readonly dateRange: string;
}

export function TournamentHeroCard({
  tournament,
  status,
  statusLabel,
  dateRange,
}: TournamentHeroCardProps) {
  return (
    <View style={styles.root} testID="tournament-hero">
      <AppEmberGlow />
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <AppTag label={tournament.level} variant="outline" />
          <TournamentStatusLabel label={statusLabel} status={status} />
        </View>
        <Text accessibilityRole="header" style={styles.name}>
          {tournament.name}
        </Text>
        <Text style={styles.place}>
          {tournament.place} · {dateRange}
        </Text>
        {tournament.stats ? (
          <View style={styles.stats}>
            {tournament.stats.map(stat => (
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semanticColors.background.eventSurface,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.banner,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 18,
  },
  content: { gap: 12 },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: { ...dsTypography.title, color: semanticColors.text.primary },
  place: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1 },
  statValue: {
    ...dsTypography.stat,
    color: semanticColors.text.primary,
    fontSize: 24,
    lineHeight: 26,
  },
  statLabel: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
});
