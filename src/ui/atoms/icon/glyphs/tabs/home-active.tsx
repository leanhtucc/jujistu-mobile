import React from 'react';
import { Image } from 'react-native';

import type { GlyphProps } from '../../icon.types';

const HOME_ICON_ASPECT_RATIO = 27 / 23;

/**
 * Active Home artwork exported from Figma.
 *
 * Unlike the inactive monochrome glyph, this asset contains the orange/red
 * active-state artwork and must keep its original colours.
 */
export function HomeActiveGlyph({ size }: GlyphProps) {
  return (
    <Image
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      resizeMode="contain"
      source={require('../../../../../../assets/icons/tabs/home-active-figma.png')}
      style={{ width: size, height: size / HOME_ICON_ASPECT_RATIO }}
    />
  );
}
