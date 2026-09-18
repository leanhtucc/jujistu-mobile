import {
  borderWidth,
  opacity,
  primitiveColors,
  radius,
  semanticColors,
  semanticGradients,
  spacing,
} from '@jujistu/shared/theme';

import type {
  ButtonAppearance,
  ButtonSize,
  ButtonVariant,
} from './button.types';

const buttonComponentTokens = {
  primary: {
    background: primitiveColors.red[500],
  },
  secondaryDark: {
    background: primitiveColors.neutral[700],
  },
  secondaryLight: {
    background: primitiveColors.neutral[0],
  },
} as const;

export interface AppButtonVisualRecipe {
  backgroundColor?: string;
  foregroundColor: string;
  gradient?: {
    left: string;
    right: string;
  };
  borderColor?: string;
  borderWidth?: number;
  opacity: number;
}

export interface AppButtonSizeRecipe {
  height: number;
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  borderRadius: number;
  iconSize: number;
}

export function resolveAppButtonVisualRecipe(
  variant: ButtonVariant,
  disabled: boolean,
  appearance: ButtonAppearance = 'filled',
  pressed = false,
): AppButtonVisualRecipe {
  const resolvedOpacity = disabled
    ? opacity.disabled
    : pressed
    ? 0.8
    : opacity.full;
  const defaultForeground =
    variant === 'primary'
      ? semanticColors.text.accent
      : semanticColors.text.primary;

  if (appearance === 'outline') {
    return {
      backgroundColor: 'transparent',
      borderColor:
        variant === 'primary'
          ? semanticColors.border.accent
          : variant === 'secondaryDark'
          ? semanticColors.border.strong
          : primitiveColors.neutral[0],
      borderWidth: borderWidth.thin,
      foregroundColor: defaultForeground,
      opacity: resolvedOpacity,
    };
  }

  if (appearance === 'ghost') {
    return {
      backgroundColor: 'transparent',
      foregroundColor: defaultForeground,
      opacity: resolvedOpacity,
    };
  }

  if (appearance === 'soft') {
    return {
      backgroundColor: semanticColors.background.surfaceSubtle,
      foregroundColor: defaultForeground,
      opacity: resolvedOpacity,
    };
  }

  if (variant === 'primary') {
    if (!disabled) {
      return {
        backgroundColor: 'transparent',
        foregroundColor: semanticColors.text.primary,
        gradient: {
          left: semanticGradients.action.primary.start,
          right: semanticGradients.action.primary.end,
        },
        opacity: resolvedOpacity,
      };
    }

    return {
      backgroundColor: buttonComponentTokens.primary.background,
      foregroundColor: semanticColors.text.primary,
      opacity: resolvedOpacity,
    };
  }

  if (variant === 'secondaryDark') {
    return {
      backgroundColor: buttonComponentTokens.secondaryDark.background,
      foregroundColor: semanticColors.text.primary,
      opacity: resolvedOpacity,
    };
  }

  return {
    backgroundColor: buttonComponentTokens.secondaryLight.background,
    foregroundColor: primitiveColors.neutral[700],
    opacity: resolvedOpacity,
  };
}

export function resolveAppButtonSizeRecipe(
  size: ButtonSize,
  hasIcon: boolean,
): AppButtonSizeRecipe {
  if (size === 'lg') {
    return {
      height: 56,
      paddingHorizontal: spacing[12],
      paddingVertical: spacing[8],
      gap: spacing[3],
      borderRadius: radius.xs,
      iconSize: 20,
    };
  }

  if (size === 'md') {
    return {
      height: 48,
      paddingHorizontal: spacing[8],
      paddingVertical: spacing[6],
      gap: spacing[2],
      borderRadius: radius.xs,
      iconSize: 16,
    };
  }

  return {
    height: hasIcon ? 32 : 30,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    gap: spacing[2],
    borderRadius: radius.xs,
    iconSize: 16,
  };
}
