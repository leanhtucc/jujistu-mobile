import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import type { GlyphProps } from '../../icon.types';
export function SearchGlyph({ size, color }: GlyphProps) {
  return (
    <Svg
      preserveAspectRatio="none"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <G id="search">
        <Path
          id="Vector"
          d="M17.5003 17.5003L13.8753 13.8753M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
