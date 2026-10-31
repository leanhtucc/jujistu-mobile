import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { MedalTableRow } from '../types/tournament.types';

export interface TournamentMedalTableTabProps {
  readonly rows: readonly MedalTableRow[];
}

export function TournamentMedalTableTab({
  rows,
}: TournamentMedalTableTabProps) {
  return (
    <View testID="tournament-medal-table-tab">
      <View style={styles.headRow}>
        <Text style={[styles.head, styles.rankCol]}>#</Text>
        <Text style={[styles.head, styles.teamCol]}>ĐOÀN</Text>
        <Text style={[styles.head, styles.numCol]}>HCV</Text>
        <Text style={[styles.head, styles.numCol]}>HCB</Text>
        <Text style={[styles.head, styles.numCol]}>HCĐ</Text>
        <Text style={[styles.head, styles.totalCol]}>TỔNG</Text>
      </View>
      {rows.map(row => (
        <View
          accessibilityLabel={`Hạng ${row.rank}, ${row.team}, ${row.gold} vàng, ${row.silver} bạc, ${row.bronze} đồng`}
          accessible
          key={row.team}
          style={styles.row}
          testID={`tournament-medal-row-${row.rank}`}
        >
          <Text
            style={[
              styles.cell,
              styles.rankCol,
              {
                color:
                  row.rank <= 3
                    ? semanticColors.text.accent
                    : semanticColors.text.tertiary,
              },
            ]}
          >
            {row.rank}
          </Text>
          <Text style={[styles.team, styles.teamCol]}>{row.team}</Text>
          <Text
            style={[
              styles.cell,
              styles.numCol,
              { color: semanticColors.text.accent },
            ]}
          >
            {row.gold}
          </Text>
          <Text style={[styles.cell, styles.numCol]}>{row.silver}</Text>
          <Text style={[styles.cell, styles.numCol]}>{row.bronze}</Text>
          <Text
            style={[
              styles.cell,
              styles.totalCol,
              { color: semanticColors.text.secondary },
            ]}
          >
            {row.total}
          </Text>
        </View>
      ))}
      <Text style={styles.footnote}>
        Xếp theo số huy chương vàng, sau đó bạc và đồng.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row', gap: 6, paddingBottom: 8 },
  head: { ...dsTypography.overline, color: semanticColors.text.tertiary },
  row: {
    alignItems: 'center',
    borderTopColor: semanticColors.stitch.color,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 12,
  },
  cell: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 14,
  },
  team: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  rankCol: { width: 24 },
  teamCol: { flex: 1, minWidth: 0 },
  numCol: { textAlign: 'center', width: 36 },
  totalCol: { textAlign: 'right', width: 40 },
  footnote: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
    paddingTop: 12,
  },
});
