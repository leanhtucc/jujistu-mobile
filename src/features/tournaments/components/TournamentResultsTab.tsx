import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppAvatar, AppCard, AppIcon, AppTag } from '@jujistu/ui';
import type { TagVariant } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DivisionResult, MedalKind } from '../types/tournament.types';

export interface TournamentResultsTabProps {
  readonly results: readonly DivisionResult[];
  readonly onPressAthlete?: (athleteId: string) => void;
}

const MEDAL_VARIANTS: Record<MedalKind, TagVariant> = {
  HCV: 'accent',
  HCB: 'neutral',
  HCĐ: 'outline',
};

export function TournamentResultsTab({
  results,
  onPressAthlete,
}: TournamentResultsTabProps) {
  return (
    <View style={styles.root} testID="tournament-results-tab">
      {results.map(result => (
        <AppCard
          key={result.division}
          lapel={false}
          style={styles.card}
          testID={`tournament-result-${result.division}`}
        >
          <Text style={styles.division}>{result.division}</Text>
          <Text style={styles.summary}>{result.finalSummary}</Text>
          {result.medals.map(winner => {
            const interactive = Boolean(winner.athleteId);

            return (
              <Pressable
                accessibilityLabel={`${winner.medal} ${winner.name}, ${winner.team}`}
                accessibilityRole={interactive ? 'button' : 'text'}
                disabled={!interactive}
                key={`${winner.medal}-${winner.name}`}
                onPress={() =>
                  winner.athleteId
                    ? onPressAthlete?.(winner.athleteId)
                    : undefined
                }
                style={styles.medalRow}
              >
                <View style={styles.medalTag}>
                  <AppTag
                    label={winner.medal}
                    variant={MEDAL_VARIANTS[winner.medal]}
                  />
                </View>
                <AppAvatar name={winner.name} size={30} />
                <View style={styles.winnerText}>
                  <Text style={styles.winnerName}>{winner.name}</Text>
                  <Text style={styles.winnerTeam}>{winner.team}</Text>
                </View>
                {interactive ? (
                  <AppIcon
                    accessible={false}
                    color={semanticColors.text.accent}
                    name="arrowRight"
                    size={16}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </AppCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 16 },
  card: { paddingBottom: 6, paddingHorizontal: 16, paddingTop: 14 },
  division: { ...dsTypography.overline, color: semanticColors.text.accent },
  summary: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
    marginTop: 4,
  },
  medalRow: {
    alignItems: 'center',
    borderTopColor: semanticColors.stitch.color,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 9,
  },
  medalTag: { width: 44 },
  winnerText: { flex: 1, minWidth: 0 },
  winnerName: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
  },
  winnerTeam: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
});
