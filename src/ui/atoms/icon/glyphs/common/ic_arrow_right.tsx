import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function ArrowRightGlyph({ size, color }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Svg>
  );
}
