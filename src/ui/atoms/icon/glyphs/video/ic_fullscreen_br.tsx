import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import type { GlyphProps } from '../../icon.types';
export function FullscreenBrGlyph({ size, color }: GlyphProps) {
  return (
    <Svg
      preserveAspectRatio="none"
      width={size}
      height={size}
      viewBox="0 0 6 6"
      fill="none"
    >
      <G id="Group">
        <Path id="ytp id 8" d="M4 4H0V6H6V0H4V4Z" fill={color} />
      </G>
    </Svg>
  );
}
