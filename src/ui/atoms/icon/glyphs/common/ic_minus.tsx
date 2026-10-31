import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function MinusGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10h18v4H3z" fill={color} />
    </Svg>
  );
}
