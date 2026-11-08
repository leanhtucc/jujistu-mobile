import React from 'react';
import { StyleSheet, View } from 'react-native';

import { primitiveColors, semanticColors } from '@jujistu/shared/theme';

import { PrimaryGradientFill } from '../utils/primary-gradient-fill';

export interface ProgressBarProps {
  /** Completed fraction, clamped to 0..1. */
  readonly value: number;
  readonly height?: number;
  /** When segments > 1, renders discrete pill segments matching the prototype. */
  readonly segments?: number;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
}

export function AppProgressBar({
  value,
  height = 6,
  segments,
  accessibilityLabel,
  testID = 'app-progress-bar',
}: ProgressBarProps) {
  const fraction = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

  if (segments && segments > 1) {
    const filledCount = Math.round(fraction * segments);
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(fraction * 100),
        }}
        style={[styles.segmentContainer, { height }]}
        testID={testID}
      >
        {Array.from({ length: segments }).map((_, index) => {
          const isFilled = index < filledCount;
          return (
            <View
              key={index}
              style={[
                styles.segment,
                {
                  borderRadius: height / 2,
                  backgroundColor: isFilled
                    ? primitiveColors.ember[600]
                    : semanticColors.background.surfaceElevated,
                  borderColor: isFilled
                    ? primitiveColors.orange[500]
                    : primitiveColors.alpha.white06,
                },
              ]}
              testID={`${testID}-segment-${index}`}
            >
              {isFilled ? <PrimaryGradientFill /> : null}
            </View>
          );
        })}
      </View>
    );
  }

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
        {/* The key remounts the SVG: on Android it keeps its first size when the fill grows. */}
        {fraction > 0 ? (
          <PrimaryGradientFill key={Math.round(fraction * 1000)} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: 'row',
    gap: 3.5,
    width: '100%',
  },
  segment: {
    borderWidth: 0.5,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
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
