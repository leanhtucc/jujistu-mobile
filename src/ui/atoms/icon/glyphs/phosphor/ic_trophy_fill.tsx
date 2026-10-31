import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function TrophyFillGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <G transform="translate(0, 960) scale(1, -1)">
        <Path
          d="M928 704h-96v64c0 17.673-14.327 32-32 32v0h-576c-17.673 0-32-14.327-32-32v0-64h-96c-35.346 0-64-28.654-64-64v0-64c0-88.366 71.634-160 160-160v0h14.6c38.943-120.722 144.334-209.004 272.018-222.323l1.382-0.117v-97.56h-96c-17.673 0-32-14.327-32-32s14.327-32 32-32v0h256c17.673 0 32 14.327 32 32s-14.327 32-32 32v0h-96v97.68c127.76 12.92 233.76 102.56 272.32 222.32h15.68c88.366 0 160 71.634 160 160v0 64c0 35.346-28.654 64-64 64v0zM192 480c-53.019 0-96 42.981-96 96v0 64h96v-128q0-16 1.56-32zM928 576c0-53.019-42.981-96-96-96v0h-2c1.253 10.661 1.979 23.034 2 35.572v124.428h96z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
