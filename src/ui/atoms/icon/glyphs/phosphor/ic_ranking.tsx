import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function RankingGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <G transform="translate(0, 960) scale(1, -1)">
        <Path
          d="M434.48 544.84c-1.555 4.52-2.452 9.728-2.452 15.146 0 21.076 13.584 38.98 32.474 45.434l0.338 0.1 48 16c4.524 1.558 9.737 2.457 15.16 2.457 26.502 0 47.987-21.477 48-47.976v-160.001c0-26.51-21.49-48-48-48s-48 21.49-48 48v0 96c-21.077 0.010-38.977 13.604-45.42 32.502l-0.1 0.338zM1008 128c0-26.51-21.49-48-48-48v0h-896c-26.51 0-48 21.49-48 48s21.49 48 48 48v0h16v368c0 44.183 35.817 80 80 80v0h144v112c0 44.183 35.817 80 80 80v0h256c44.183 0 80-35.817 80-80v0-272h144c44.183 0 80-35.817 80-80v0-208h16c26.51 0 48-21.49 48-48v0zM720 368v-192h128v192zM400 176h224v544h-224zM176 176h128v352h-128z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
