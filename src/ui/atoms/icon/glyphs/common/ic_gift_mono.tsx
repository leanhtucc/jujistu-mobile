import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function GiftMonoGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 8h20v4H2zM4 13h16v9H4zM11 8h2v14h-2z"
        fill={color}
        fillRule="evenodd"
      />
      <Path
        d="M12 8C9 8 7 7 7 5.5S8.5 3 10 3.5 12 6 12 8zm0 0c3 0 5-1 5-2.5S15.5 3 14 3.5 12 6 12 8z"
        fill={color}
      />
    </Svg>
  );
}
