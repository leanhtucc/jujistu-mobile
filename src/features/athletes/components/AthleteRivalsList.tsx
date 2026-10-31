import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppAvatar } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { AthleteRival } from '../types/athlete.types';

export interface AthleteRivalsListProps {
  readonly rivals: readonly AthleteRival[];
}

export function AthleteRivalsList({ rivals }: AthleteRivalsListProps) {
  return (
    <View testID="athlete-rivals">
      <Text accessibilityRole="header" style={styles.title}>
        Đối thủ thường gặp
      </Text>
      {rivals.map(rival => (
        <View
          accessibilityLabel={`${rival.name}, ${rival.team}, ${rival.meetings} lần gặp, tỷ số ${rival.record}`}
          accessible
          key={rival.name}
          style={styles.row}
        >
          <AppAvatar name={rival.name} size={38} />
          <View style={styles.text}>
            <Text style={styles.name}>{rival.name}</Text>
            <Text style={styles.meta}>
              {rival.team} · {rival.meetings} lần gặp
            </Text>
          </View>
          <Text
            style={[
              styles.record,
              {
                color: rival.trailing
                  ? semanticColors.text.secondary
                  : semanticColors.text.accent,
              },
            ]}
          >
            {rival.record}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...dsTypography.title,
    color: semanticColors.text.primary,
    marginBottom: 4,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: semanticColors.stitch.color,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  text: { flex: 1, minWidth: 0 },
  name: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  meta: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
  record: { ...dsTypography.counter, fontSize: 16, lineHeight: 18 },
});
