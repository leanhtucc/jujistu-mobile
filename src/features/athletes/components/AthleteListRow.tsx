import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppAvatar, AppIcon } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AthleteSummary } from '../types/athlete.types';

export interface AthleteListRowProps {
  readonly athlete: AthleteSummary;
  readonly onPress?: (athlete: AthleteSummary) => void;
}

export function AthleteListRow({ athlete, onPress }: AthleteListRowProps) {
  return (
    <Pressable
      accessibilityLabel={`${athlete.name}, ${athlete.team}, ${athlete.division}, ${athlete.goldMedals} huy chương vàng`}
      accessibilityRole="button"
      onPress={() => onPress?.(athlete)}
      style={({ pressed }) => [styles.root, pressed ? styles.pressed : null]}
      testID={`athlete-row-${athlete.id}`}
    >
      <AppAvatar belt={athlete.belt} name={athlete.name} size={46} />
      <View style={styles.text}>
        <Text style={styles.name}>{athlete.name}</Text>
        <Text style={styles.meta}>
          {athlete.team} · {athlete.division}
        </Text>
      </View>
      <View style={styles.gold}>
        <Text style={styles.goldCount}>{athlete.goldMedals}</Text>
        <Text style={styles.goldLabel}>HCV</Text>
      </View>
      <AppIcon
        accessible={false}
        color={semanticColors.icon.tertiary}
        name="arrowRight"
        size={16}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderBottomColor: semanticColors.stitch.color,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  pressed: { opacity: 0.8 },
  text: { flex: 1, minWidth: 0 },
  name: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  meta: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
  gold: { alignItems: 'flex-end', gap: 3 },
  goldCount: {
    ...dsTypography.counter,
    color: semanticColors.text.accent,
    fontSize: 14,
  },
  goldLabel: { ...dsTypography.overline, color: semanticColors.text.tertiary },
});
