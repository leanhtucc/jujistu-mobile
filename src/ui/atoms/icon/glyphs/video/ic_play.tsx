import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import type { GlyphProps } from '../../icon.types';
export function PlayGlyph({ size, color }: GlyphProps) {
  return (
    <Svg
      preserveAspectRatio="none"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <G id="Iconly/Regular/Bold/Play">
        <Path
          id="Vector 1"
          d="M4.16667 15.6002V4.39982C4.16667 3.57795 5.11672 3.06588 5.87323 3.48L16.1037 9.08018C16.8543 9.49109 16.8543 10.5089 16.1037 10.9198L5.87323 16.52C5.11672 16.9341 4.16667 16.422 4.16667 15.6002Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
