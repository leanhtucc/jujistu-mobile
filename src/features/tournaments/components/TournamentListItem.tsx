import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';
import { AppEmberGlow, AppTag } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  TournamentListEntry,
  TournamentStatus,
} from '../types/tournament.types';
import { TournamentStatusLabel } from './TournamentStatusLabel';

export interface TournamentListItemProps {
  readonly entry: TournamentListEntry;
  readonly onPress?: (tournamentId: string) => void;
}

const GLOW_BY_STATUS: Record<TournamentStatus, number> = {
  live: 1,
  upcoming: 0.45,
  done: 0,
};

export function TournamentListItem({
  entry,
  onPress,
}: TournamentListItemProps) {
  const { tournament, status, statusLabel, monthLabel, year } = entry;
  const live = status === 'live';

  return (
    <Pressable
      accessibilityLabel={`${tournament.name}, ${statusLabel}, ${tournament.place}`}
      accessibilityRole="button"
      onPress={() => onPress?.(tournament.id)}
      style={({ pressed }) => [
        styles.root,
        live ? styles.rootLive : null,
        pressed ? styles.pressed : null,
      ]}
      testID={`tournament-item-${tournament.id}`}
    >
      <View style={styles.dateBlock}>
        <AppEmberGlow intensity={GLOW_BY_STATUS[status]} />
        <Text style={styles.days}>{tournament.dayRange}</Text>
        <Text style={styles.month}>{monthLabel}</Text>
        <Text style={styles.year}>{year}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.statusRow}>
          <AppTag label={tournament.level} variant="outline" />
          <TournamentStatusLabel label={statusLabel} status={status} />
        </View>
        <Text style={styles.name}>{tournament.name}</Text>
        <Text style={styles.place}>{tournament.place}</Text>
        <View style={styles.disciplines}>
          {tournament.disciplines.map(discipline => (
            <Text key={discipline} style={styles.discipline}>
              {discipline}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 12,
  },
  rootLive: {
    backgroundColor: semanticColors.background.surfaceElevated,
    borderColor: semanticColors.border.accent,
  },
  pressed: { transform: [{ scale: 0.98 }] },
  dateBlock: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.eventSurface,
    borderColor: semanticColors.border.subtle,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    justifyContent: 'center',
    minHeight: 96,
    overflow: 'hidden',
    width: 72,
  },
  days: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 17,
    lineHeight: 20,
  },
  month: { ...dsTypography.overline, color: semanticColors.text.accent },
  year: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
    fontSize: 10,
  },
  info: { flex: 1, gap: 6, minWidth: 0 },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  place: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
  disciplines: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  discipline: {
    ...dsTypography.counter,
    backgroundColor: semanticColors.background.surfaceElevated,
    borderRadius: radius.xs,
    color: semanticColors.text.secondary,
    fontSize: 10,
    lineHeight: 12,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
});
