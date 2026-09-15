import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { glyphs } from './glyphs';

export interface GlyphProps {
  size: number;
  color: string;
}

export type GlyphComponent = React.ComponentType<GlyphProps>;

/**
 * Public IconName union derived strictly from the implemented glyph registry.
 * Contains ONLY VERIFIED_IMPLEMENTED glyphs.
 * Candidate and blocked glyphs are NOT included until verified and registered.
 *
 * When the registry is empty (0 verified glyphs), this evaluates to `never`.
 */
export type IconName = keyof typeof glyphs;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
  accessible?: boolean;
  style?: StyleProp<ViewStyle>;
}
