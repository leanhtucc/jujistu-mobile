import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function PlusGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" fill={color} />
    </Svg>
  );
}
