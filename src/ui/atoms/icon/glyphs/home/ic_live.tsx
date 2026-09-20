import React from 'react';
import Svg, {
  Ellipse,
  Rect,
  G,
  Defs,
  Pattern,
  Use,
  Image,
} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import type { GlyphProps } from '../../icon.types';
export function LiveGlyph({ size, color: _color }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 34 40" fill="none">
      <Ellipse
        cx={17.0312}
        cy={17.5229}
        rx={16.7041}
        ry={17.5229}
        fill="#840000"
      />
      <Ellipse
        cx={17.0323}
        cy={15.2302}
        rx={5.89556}
        ry={6.05932}
        fill="white"
      />
      <Rect
        x={4.91309}
        y={28.1677}
        width={23.9098}
        height={9.82592}
        fill="white"
      />
      <G filter="url(#filter0_i_26942_145273)">
        <Rect width={34} height={39.9588} fill="url(#pattern0_26942_145273)" />
      </G>
      <Defs>
        <Pattern
          id="pattern0_26942_145273"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use
            xlinkHref="#image0_26942_145273"
            transform="matrix(0.00302901 0 0 0.00257732 -0.00281641 0)"
          />
        </Pattern>
        <Image
          id="image0_26942_145273"
          width={332}
          height={388}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
}
