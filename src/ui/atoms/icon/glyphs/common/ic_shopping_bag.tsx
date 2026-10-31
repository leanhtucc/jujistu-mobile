import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function ShoppingBagGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 8V7a5 5 0 0 1 10 0v1h3.2l1.3 14H2.5L3.8 8zm2.5 0h5V7a2.5 2.5 0 0 0-5 0zM8.5 11.5v2h2v-2zm5 0v2h2v-2z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}
