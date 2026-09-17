import {
  fontFamilies,
  radius,
  semanticColors,
  spacing,
} from '@jujistu/shared/theme';

import type { TabAppearance, TabSize, TabVariant } from './tab.types';

export interface TabSizeRecipe {
  minHeight: number;
  minWidth: number;
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  iconSize: number;
  fontSize: number;
  lineHeight: number;
  borderRadius: number;
}

export interface TabColors {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  contentColor: string;
}

export const tabSizeRecipes: Record<TabSize, TabSizeRecipe> = {
  sm: {
    minHeight: 40,
    minWidth: 40,
    paddingHorizontal: spacing[6], // 12
    paddingVertical: spacing[4], // 8
    gap: spacing[3], // 6
    iconSize: 16,
    fontSize: 12,
    lineHeight: 16,
    borderRadius: radius.md, // 8
  },
  md: {
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: spacing[8], // 16
    paddingVertical: spacing[5], // 10
    gap: spacing[4], // 8
    iconSize: 20,
    fontSize: 14,
    lineHeight: 20,
    borderRadius: radius.md, // 8
  },
  lg: {
    minHeight: 56,
    minWidth: 56,
    paddingHorizontal: 20,
    paddingVertical: spacing[6], // 12
    gap: spacing[5], // 10
    iconSize: 24,
    fontSize: 16,
    lineHeight: 24,
    borderRadius: radius.md, // 8
  },
};

export function resolveTabColors({
  selected,
  disabled,
  appearance = 'filled',
  variant = 'primary',
}: {
  selected?: boolean;
  disabled?: boolean;
  appearance?: TabAppearance;
  variant?: TabVariant;
}): TabColors {
  if (disabled) {
    return {
      backgroundColor: semanticColors.background.surface,
      borderColor: semanticColors.border.default,
      borderWidth: 1,
      contentColor: semanticColors.text.tertiary,
    };
  }

  if (selected) {
    if (variant === 'primary') {
      if (appearance === 'soft') {
        return {
          backgroundColor: semanticColors.background.surfaceSubtle,
          borderColor: semanticColors.border.accent,
          borderWidth: 1,
          contentColor: semanticColors.text.accent,
        };
      }
      return {
        backgroundColor: semanticColors.action.primary,
        contentColor: semanticColors.text.primary,
      };
    }

    // neutral variant
    if (appearance === 'soft') {
      return {
        backgroundColor: semanticColors.background.surfaceSubtle,
        borderColor: semanticColors.border.strong,
        borderWidth: 1,
        contentColor: semanticColors.text.primary,
      };
    }
    return {
      backgroundColor: semanticColors.background.surfaceElevated,
      contentColor: semanticColors.text.primary,
    };
  }

  // unselected
  if (appearance === 'soft') {
    return {
      backgroundColor: 'transparent',
      borderColor: semanticColors.border.subtle,
      borderWidth: 1,
      contentColor: semanticColors.text.secondary,
    };
  }

  return {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderWidth: 1,
    contentColor: semanticColors.text.secondary,
  };
}

export const tabFontFamily = fontFamilies.primary.medium;
