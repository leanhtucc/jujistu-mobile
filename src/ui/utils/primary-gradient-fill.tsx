import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { semanticGradients } from '@jujistu/shared/theme';

const GRADIENT_ID = 'app-primary-gradient';

export function PrimaryGradientFill() {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={GRADIENT_ID} x1="0%" x2="100%" y1="50%" y2="50%">
          <Stop offset="0" stopColor={semanticGradients.action.primary.start} />
          <Stop offset="1" stopColor={semanticGradients.action.primary.end} />
        </LinearGradient>
      </Defs>
      <Rect fill={`url(#${GRADIENT_ID})`} height="100%" width="100%" />
    </Svg>
  );
}
