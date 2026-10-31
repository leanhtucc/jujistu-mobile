import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function BellGlyph({ size, color }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm6.5-6v-5a6.5 6.5 0 0 0-5.5-6.42V4a1 1 0 0 0-2 0v.58A6.5 6.5 0 0 0 5.5 11v5l-2 2v1h17v-1l-2-2z"
        fill={color}
      />
    </Svg>
  );
}
