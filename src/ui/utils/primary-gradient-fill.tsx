import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { semanticGradients } from '@jujistu/shared/theme';

const GRADIENT_ID = 'app-primary-gradient';

export function PrimaryGradientFill() {
  return (
    <Svg
      height="100%"
      pointerEvents="none"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
      viewBox="0 0 1 1"
      width="100%"
    >
      <Defs>
        <LinearGradient id={GRADIENT_ID} x1="0" x2="1" y1="0" y2="0">
          <Stop offset="0" stopColor={semanticGradients.action.primary.start} />
          <Stop offset="1" stopColor={semanticGradients.action.primary.end} />
        </LinearGradient>
      </Defs>
      <Rect fill={`url(#${GRADIENT_ID})`} height="1" width="1" />
    </Svg>
  );
}
