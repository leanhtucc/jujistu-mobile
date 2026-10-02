import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import type { GlyphProps } from '../../icon.types';
export function FullscreenBlGlyph({ size, color }: GlyphProps) {
  return (
    <Svg
      preserveAspectRatio="none"
      width={size}
      height={size}
      viewBox="0 0 6 6"
      fill="none"
    >
      <G id="Group">
        <Path id="ytp id 9" d="M2 0H0V6H6V4H2V0Z" fill={color} />
      </G>
    </Svg>
  );
}
