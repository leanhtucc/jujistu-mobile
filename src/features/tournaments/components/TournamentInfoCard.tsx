import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppCard } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TournamentInfoRow } from '../hooks/use-tournament-detail';

export interface TournamentInfoCardProps {
  readonly rows: readonly TournamentInfoRow[];
  readonly note: string;
}

export function TournamentInfoCard({ rows, note }: TournamentInfoCardProps) {
  return (
    <View style={styles.root} testID="tournament-info">
      <AppCard lapel={false} style={styles.card}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[styles.row, index > 0 ? styles.rowDivider : null]}
          >
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
      </AppCard>
      <View style={styles.note}>
        <Text style={styles.noteText}>{note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 14 },
  card: { paddingHorizontal: 16, paddingVertical: 4 },
  row: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowDivider: {
    borderTopColor: semanticColors.stitch.color,
    borderTopWidth: 1,
  },
  label: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 18,
  },
  value: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'right',
  },
  note: {
    alignItems: 'center',
    borderColor: semanticColors.border.default,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 28,
  },
  noteText: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    textAlign: 'center',
  },
});
