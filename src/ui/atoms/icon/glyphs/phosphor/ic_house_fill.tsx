import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function HouseFillGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <G transform="translate(0, 960) scale(1, -1)">
        <Path
          d="M896 480v-384c0-17.673-14.327-32-32-32v0h-224c-17.673 0-32 14.327-32 32v0 208c0 8.837-7.163 16-16 16v0h-160c-8.837 0-16-7.163-16-16v0-208c0-17.673-14.327-32-32-32v0h-224c-17.673 0-32 14.327-32 32v0 384c0.008 17.67 7.176 33.664 18.76 45.24l320 320c11.58 11.573 27.574 18.73 45.24 18.73s33.66-7.157 45.24-18.731l320-320c11.584-11.576 18.752-27.57 18.76-45.238v-0.002z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
