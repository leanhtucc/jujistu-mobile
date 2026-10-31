import React from 'react';
import { StyleSheet, View } from 'react-native';

import { primitiveColors, semanticColors } from '@jujistu/shared/theme';

import { PrimaryGradientFill } from '../utils/primary-gradient-fill';

export interface ProgressBarProps {
  /** Completed fraction, clamped to 0..1. */
  readonly value: number;
  readonly height?: number;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
}

export function AppProgressBar({
  value,
  height = 6,
  accessibilityLabel,
  testID = 'app-progress-bar',
}: ProgressBarProps) {
  const fraction = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(fraction * 100) }}
      style={[styles.track, { height, borderRadius: height / 2 }]}
      testID={testID}
    >
      <View
        style={[
          styles.fill,
          { width: `${fraction * 100}%`, borderRadius: height / 2 },
        ]}
        testID={`${testID}-fill`}
      >
        {fraction > 0 ? <PrimaryGradientFill /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: semanticColors.background.surfaceElevated,
    borderColor: primitiveColors.alpha.white06,
    borderWidth: 0.5,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
});
