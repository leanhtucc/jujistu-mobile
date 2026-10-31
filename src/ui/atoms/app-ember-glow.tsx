import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { primitiveColors } from '@jujistu/shared/theme';

const GRADIENT_ID = 'app-ember-glow';

export interface EmberGlowProps {
  /** Overall strength of the wash, 0..1. */
  readonly intensity?: number;
}

/**
 * Radial orange/red wash from the top-right corner. It fills its parent and
 * is the design system's only permitted background layer besides weave.
 */
export function AppEmberGlow({ intensity = 1 }: EmberGlowProps) {
  const strength = Math.min(1, Math.max(0, intensity));

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity: strength }]}
      testID="app-ember-glow"
    >
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient
            cx="100%"
            cy="0%"
            fx="100%"
            fy="0%"
            id={GRADIENT_ID}
            rx="90%"
            ry="65%"
          >
            <Stop offset="0%" stopColor="#FF8A2E" stopOpacity="0.32" />
            <Stop offset="35%" stopColor="#D42A1E" stopOpacity="0.22" />
            <Stop offset="65%" stopColor="#6B0A12" stopOpacity="0.14" />
            <Stop
              offset="100%"
              stopColor={primitiveColors.neutral[900]}
              stopOpacity="0"
            />
          </RadialGradient>
        </Defs>
        <Rect fill={`url(#${GRADIENT_ID})`} height="100%" width="100%" />
      </Svg>
    </View>
  );
}
