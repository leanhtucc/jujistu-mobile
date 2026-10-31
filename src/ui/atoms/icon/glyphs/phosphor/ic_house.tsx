import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function HouseGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <G transform="translate(0, 960) scale(1, -1)">
        <Path
          d="M888.56 536.6l-320 320c-14.476 14.472-34.473 23.423-56.56 23.423s-42.084-8.951-56.56-23.423l-320-320c-14.479-14.393-23.44-34.322-23.44-56.345 0-0.090 0-0.179 0-0.269v0.014-384c0-26.51 21.49-48 48-48v0h256c26.51 0 48 21.49 48 48v0 208h96v-208c0-26.51 21.49-48 48-48v0h256c26.51 0 48 21.49 48 48v0 384c0 0.076 0 0.165 0 0.255 0 22.023-8.961 41.952-23.437 56.341l-0.004 0.004zM816 144h-160v208c0 26.51-21.49 48-48 48v0h-192c-26.51 0-48-21.49-48-48v0-208h-160v329.4l304 304 304-304z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
