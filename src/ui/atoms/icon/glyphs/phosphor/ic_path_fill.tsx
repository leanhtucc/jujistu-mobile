import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function PathFillGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <G transform="translate(0, 960) scale(1, -1)">
        <Path
          d="M912 160c-0.022-61.84-50.157-111.962-112-111.962-50.432 0-93.079 33.333-107.111 79.169l-0.209 0.793h-404.68c-106.039 0-192 85.961-192 192s85.961 192 192 192v0h384c53.019 0 96 42.981 96 96s-42.981 96-96 96v0h-384c-17.673 0-32 14.327-32 32s14.327 32 32 32v0h384c88.366 0 160-71.634 160-160s-71.634-160-160-160v0h-384c-70.692 0-128-57.308-128-128s57.308-128 128-128v0h404.68c14.241 46.63 56.888 79.962 107.32 79.962 61.843 0 111.978-50.123 112-111.96v-0.002z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
