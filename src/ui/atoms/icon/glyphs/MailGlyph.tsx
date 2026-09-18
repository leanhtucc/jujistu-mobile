import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from '../icon.types';

/** Exact mail glyph exported from Figma node 24855:5539. */
export function MailGlyph({ size, color }: GlyphProps) {
  return (
    <Svg accessible={false} height={size} viewBox="0 0 22 18" width={size}>
      <Path
        d="M0 3.53518V15C0 16.6523 1.34772 18 3 18H19C20.6523 18 22 16.6523 22 15V3.53518L21.5641 3.82577L11.5735 10.8192C11.2291 11.0603 10.7709 11.0603 10.4265 10.8192L0.435846 3.82575L0 3.53518Z"
        fill={color}
      />
      <Path
        d="M21.5539 1.4289C21.0246 0.572594 20.077 0 19 0H3C1.92302 0 0.975432 0.572594 0.446129 1.4289L1.5547 2.16795L1.57346 2.18077L11 8.77934L20.4265 2.18077L20.4453 2.16795L21.5539 1.4289Z"
        fill={color}
      />
    </Svg>
  );
}
