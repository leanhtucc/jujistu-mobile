import React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { radius, semanticColors } from '@jujistu/shared/theme';

export type CardVariant = 'surface' | 'elevated';

export interface CardProps {
  readonly children?: React.ReactNode;
  readonly variant?: CardVariant;
  /** Fold the top-right corner off at 45deg, like a gi lapel. Default on. */
  readonly lapel?: boolean;
  /** Dashed inner seam; use on the one or two cards per screen that matter. */
  readonly stitched?: boolean;
  /** Orange seam and border for a selected card. */
  readonly selected?: boolean;
  /** Must equal the colour behind the card so the fold reads as a cut. */
  readonly cutColor?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

const LAPEL_SIZE = 14;

export function AppCard({
  children,
  variant = 'surface',
  lapel = true,
  stitched = false,
  selected = false,
  cutColor = semanticColors.background.canvas,
  style,
  testID = 'app-card',
}: CardProps) {
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor:
            variant === 'elevated'
              ? semanticColors.background.surfaceElevated
              : semanticColors.background.surface,
          borderColor: selected
            ? semanticColors.border.accent
            : semanticColors.border.subtle,
        },
        style,
      ]}
      testID={testID}
    >
      {children}
      {stitched ? (
        <View
          pointerEvents="none"
          style={[
            styles.seam,
            {
              borderColor: selected
                ? semanticColors.stitch.accent
                : semanticColors.stitch.color,
            },
          ]}
          testID={`${testID}-seam`}
        />
      ) : null}
      {lapel ? (
        <View
          pointerEvents="none"
          style={[styles.lapelCut, { backgroundColor: cutColor }]}
          testID={`${testID}-lapel`}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  seam: {
    borderRadius: radius.card - 5,
    borderStyle: 'dashed',
    borderWidth: 1,
    bottom: 5,
    left: 5,
    position: 'absolute',
    right: 5,
    top: 5,
  },
  // A square rotated 45deg and centred on the corner hides a triangle of the card.
  lapelCut: {
    height: LAPEL_SIZE * 2,
    position: 'absolute',
    right: -LAPEL_SIZE,
    top: -LAPEL_SIZE,
    transform: [{ rotate: '45deg' }],
    width: LAPEL_SIZE * 2,
  },
});
