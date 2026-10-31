import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TournamentStatus } from '../types/tournament.types';

export interface TournamentStatusLabelProps {
  readonly status: TournamentStatus;
  readonly label: string;
}

const STATUS_COLORS: Record<TournamentStatus, string> = {
  live: semanticColors.text.accent,
  upcoming: semanticColors.text.secondary,
  done: semanticColors.text.tertiary,
};

export function TournamentStatusLabel({
  status,
  label,
}: TournamentStatusLabelProps) {
  return (
    <View style={styles.root} testID="tournament-status-label">
      {status === 'live' ? (
        <View style={styles.liveDot} testID="tournament-live-dot" />
      ) : null}
      <Text style={[styles.label, { color: STATUS_COLORS[status] }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  liveDot: {
    backgroundColor: semanticColors.action.primary,
    borderRadius: radius.full,
    height: 7,
    width: 7,
  },
  label: dsTypography.overline,
});
