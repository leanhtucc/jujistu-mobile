import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';

export type TagVariant = 'neutral' | 'accent' | 'solid' | 'outline';

export interface TagProps {
  readonly label: string;
  readonly variant?: TagVariant;
  readonly testID?: string;
}

const VARIANTS: Record<
  TagVariant,
  { background: string; foreground: string; border: string }
> = {
  neutral: {
    background: semanticColors.background.surfaceElevated,
    foreground: semanticColors.text.secondary,
    border: 'transparent',
  },
  accent: {
    background: semanticColors.background.accentTint,
    foreground: semanticColors.text.accent,
    border: 'transparent',
  },
  solid: {
    background: semanticColors.action.primary,
    foreground: semanticColors.text.primary,
    border: 'transparent',
  },
  outline: {
    background: 'transparent',
    foreground: semanticColors.text.secondary,
    border: semanticColors.border.strong,
  },
};

export function AppTag({ label, variant = 'neutral', testID }: TagProps) {
  const recipe = VARIANTS[variant];

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: recipe.background, borderColor: recipe.border },
      ]}
      testID={testID}
    >
      <Text style={[styles.label, { color: recipe.foreground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'flex-start',
    borderRadius: radius.xs,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: dsTypography.overline,
});
