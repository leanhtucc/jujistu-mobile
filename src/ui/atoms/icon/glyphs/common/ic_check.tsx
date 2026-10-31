import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function CheckGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9.4 18.6 3.6 12.8l2.8-2.8 3 3 8.2-8.2 2.8 2.8z" fill={color} />
    </Svg>
  );
}
