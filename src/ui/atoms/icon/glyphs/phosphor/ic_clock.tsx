import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function ClockGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <G transform="translate(0, 960) scale(1, -1)">
        <Path
          d="M512 880c-238.587 0-432-193.413-432-432s193.413-432 432-432c238.587 0 432 193.413 432 432v0c-0.273 238.477-193.523 431.727-431.974 432h-0.026zM512 112c-185.568 0-336 150.432-336 336s150.432 336 336 336c185.568 0 336-150.432 336-336v0c-0.205-185.485-150.515-335.795-335.98-336h-0.020zM784 448c0-26.51-21.49-48-48-48v0h-224c-26.51 0-48 21.49-48 48v0 224c0 26.51 21.49 48 48 48s48-21.49 48-48v0-176h176c26.51 0 48-21.49 48-48v0z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
