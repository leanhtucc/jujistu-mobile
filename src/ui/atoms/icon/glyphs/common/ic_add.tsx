import React from 'react';
import Svg, { G, Circle, Path, Rect, Defs, ClipPath } from 'react-native-svg';
import type { GlyphProps } from '../../icon.types';
export function AddGlyph({ size, color: _color }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <G clipPath="url(#clip0_25063_46098)">
        <Circle cx={6.66667} cy={6.66667} r={6.66667} fill="white" />
        <Path
          d="M6.66667 0C2.98438 0 0 2.98438 0 6.66667C0 10.349 2.98438 13.3333 6.66667 13.3333C10.349 13.3333 13.3333 10.349 13.3333 6.66667C13.3333 2.98438 10.349 0 6.66667 0ZM10.5547 7.22135C10.5547 7.52864 10.3073 7.77604 10 7.77604H7.77865V10C7.77865 10.3073 7.53125 10.5547 7.22396 10.5547H6.11198C5.80469 10.5547 5.55729 10.3047 5.55729 10V7.77865H3.33333C3.02604 7.77865 2.77865 7.52865 2.77865 7.22396V6.11198C2.77865 5.80469 3.02604 5.55729 3.33333 5.55729H5.55469V3.33333C5.55469 3.02604 5.80208 2.77865 6.10938 2.77865H7.22135C7.52864 2.77865 7.77604 3.02865 7.77604 3.33333V5.55469H10C10.3073 5.55469 10.5547 5.80469 10.5547 6.10938V7.22135Z"
          fill="#BA2025"
        />
      </G>
      <Rect
        x={0.75}
        y={0.75}
        width={11.8333}
        height={11.8333}
        rx={5.91667}
        stroke="#191919"
        strokeWidth={1.5}
      />
      <Defs>
        <ClipPath id="clip0_25063_46098">
          <Rect width={13.3333} height={13.3333} rx={6.66667} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
