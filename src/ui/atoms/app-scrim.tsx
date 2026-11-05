import React from 'react';
import { type DimensionValue, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { semanticColors } from '@jujistu/shared/theme';

export interface ScrimProps {
  /** Edge the scrim is anchored to; it fades out towards the opposite side. */
  readonly edge?: 'top' | 'bottom';
  readonly height?: DimensionValue;
  /** Opacity at the anchored edge, 0..1. */
  readonly strength?: number;
  readonly testID?: string;
}

/**
 * Smooth dark fade that keeps text readable over photos. A plain translucent
 * block would leave a hard edge, so this draws a real gradient.
 */
export function AppScrim({
  edge = 'bottom',
  height = '60%',
  strength = 0.88,
  testID = 'app-scrim',
}: ScrimProps) {
  const id = `app-scrim-${edge}`;
  const anchored = edge === 'bottom';

  return (
    <View
      pointerEvents="none"
      style={[styles.root, anchored ? styles.bottom : styles.top, { height }]}
      testID={testID}
    >
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <Stop
              offset="0"
              stopColor={semanticColors.background.canvas}
              stopOpacity={anchored ? 0 : strength}
            />
            <Stop
              offset={anchored ? '0.55' : '0.45'}
              stopColor={semanticColors.background.canvas}
              stopOpacity={strength * 0.55}
            />
            <Stop
              offset="1"
              stopColor={semanticColors.background.canvas}
              stopOpacity={anchored ? strength : 0}
            />
          </LinearGradient>
        </Defs>
        <Rect fill={`url(#${id})`} height="100%" width="100%" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { left: 0, position: 'absolute', right: 0 },
  bottom: { bottom: 0 },
  top: { top: 0 },
});
