import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { GlyphProps } from '../icon.types';
export function TestIconGlyph({ size, color }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L2 22h20L12 2z" fill={color} />
    </Svg>
  );
}
