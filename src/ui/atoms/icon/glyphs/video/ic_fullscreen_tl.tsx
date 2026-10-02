import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import type { GlyphProps } from '../../icon.types';
export function FullscreenTlGlyph({ size, color }: GlyphProps) {
  return (
    <Svg
      preserveAspectRatio="none"
      width={size}
      height={size}
      viewBox="0 0 6 6"
      fill="none"
    >
      <G id="Group">
        <Path id="ytp id 6" d="M0 6H2V2H6V0H0V6Z" fill={color} />
      </G>
    </Svg>
  );
}
