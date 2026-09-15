import React from 'react';
import { View } from 'react-native';

import { semanticColors } from '@jujistu/shared/theme';

import { glyphs } from './glyphs';
import type { GlyphComponent, IconProps } from './icon.types';

export interface AppIconPresentationProps {
  Glyph?: GlyphComponent;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
  accessible?: boolean;
  style?: IconProps['style'];
}

/**
 * Pure visual presentation component used as an internal test seam.
 */
export function AppIconPresentation({
  Glyph,
  size = 24,
  color = semanticColors.icon.primary,
  accessibilityLabel,
  accessible,
  style,
}: AppIconPresentationProps) {
  if (!Glyph) {
    return null;
  }

  const isAccessible = accessible ?? Boolean(accessibilityLabel);

  return (
    <View
      style={style}
      accessible={isAccessible}
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility={isAccessible ? 'yes' : 'no'}
      accessibilityElementsHidden={!isAccessible}
    >
      <Glyph size={size} color={color} />
    </View>
  );
}

/**
 * Core JUJISTU icon primitive. Interactive behavior belongs in its parent.
 */
export function AppIcon({
  name,
  size,
  color,
  accessibilityLabel,
  accessible,
  style,
}: IconProps) {
  const Glyph = (glyphs as Record<string, GlyphComponent | undefined>)[name];

  return (
    <AppIconPresentation
      Glyph={Glyph}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
      style={style}
    />
  );
}
