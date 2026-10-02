import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import type { GlyphProps } from '../../icon.types';
export function FullscreenTrGlyph({ size, color }: GlyphProps) {
  return (
    <Svg
      preserveAspectRatio="none"
      width={size}
      height={size}
      viewBox="0 0 6 6"
      fill="none"
    >
      <G id="Group">
        <Path id="ytp id 7" d="M0 0V2H4V6H6V0H0Z" fill={color} />
      </G>
    </Svg>
  );
}
