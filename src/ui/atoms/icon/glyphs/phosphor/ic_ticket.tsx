import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function TicketGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <G transform="translate(0, 960) scale(1, -1)">
        <Path
          d="M928 528c26.51 0 48 21.49 48 48v0 128c0 44.183-35.817 80-80 80v0h-768c-44.183 0-80-35.817-80-80v0-128c0-26.51 21.49-48 48-48v0c44.183 0 80-35.817 80-80s-35.817-80-80-80v0c-26.51 0-48-21.49-48-48v0-128c0-44.183 35.817-80 80-80v0h768c44.183 0 80 35.817 80 80v0 128c0 26.51-21.49 48-48 48v0c-44.183 0-80 35.817-80 80s35.817 80 80 80v0zM144 278.64c74.537 21.573 128.113 89.21 128.113 169.36s-53.576 147.787-126.869 169.051l-1.243 0.309v70.64h208v-480h-208zM880 278.64v-70.64h-432v480h432v-70.64c-74.537-21.573-128.113-89.21-128.113-169.36s53.576-147.787 126.869-169.051l1.243-0.309z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
