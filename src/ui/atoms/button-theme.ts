import {
  opacity,
  primitiveColors,
  radius,
  semanticColors,
  spacing,
} from '@jujistu/shared/theme';

import type { ButtonSize, ButtonVariant } from './button.types';

const buttonComponentTokens = {
  primary: {
    gradientLeft: '#A70100',
    gradientRight: primitiveColors.orange[500],
    disabledBackground: primitiveColors.red[500],
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
): AppButtonVisualRecipe {
  const resolvedOpacity = disabled ? opacity.disabled : opacity.full;

  if (variant === 'primary') {
    return {
      backgroundColor: disabled
        ? buttonComponentTokens.primary.disabledBackground
        : undefined,
      foregroundColor: semanticColors.text.primary,
      gradient: disabled
        ? undefined
        : {
            left: buttonComponentTokens.primary.gradientLeft,
            right: buttonComponentTokens.primary.gradientRight,
          },
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
