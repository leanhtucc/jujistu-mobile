import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { GlyphProps } from '../../icon.types';

export function PathGlyph({ size, color = 'currentColor' }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <G transform="translate(0, 960) scale(1, -1)">
        <Path
          d="M800 304c-62.294-0.090-115.325-39.644-135.441-94.996l-0.319-1.004h-376.24c-61.856 0-112 50.144-112 112s50.144 112 112 112v0h384c97.202 0 176 78.798 176 176s-78.798 176-176 176v0h-384c-26.51 0-48-21.49-48-48s21.49-48 48-48v0h384c44.183 0 80-35.817 80-80s-35.817-80-80-80v0h-384c-114.875 0-208-93.125-208-208s93.125-208 208-208v0h376.24c20.365-56.408 73.441-96 135.765-96 79.529 0 144 64.471 144 144s-64.471 144-144 144c-0.002 0-0.003 0-0.005 0v0zM800 112c-26.51 0-48 21.49-48 48s21.49 48 48 48c26.51 0 48-21.49 48-48v0c0-26.51-21.49-48-48-48v0z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
