import {
  borderWidth,
  radius,
  semanticColors,
  spacing,
  typography,
} from '@jujistu/shared/theme';

import type { OtpFieldSize, OtpFieldStatus } from './otp-field.types';

export interface OtpFieldSizeRecipe {
  height: number;
  width: number;
  gap: number;
  borderRadius: number;
  textStyle: (typeof typography.heading)[keyof typeof typography.heading];
}

export function resolveOtpFieldSizeRecipe(
  size: OtpFieldSize,
): OtpFieldSizeRecipe {
  if (size === 'lg') {
    return {
      width: 52,
      height: 64,
      gap: spacing[4],
      borderRadius: radius.xs,
      textStyle: typography.heading.lg,
    };
  }

  if (size === 'md') {
    return {
      width: 48,
      height: 60,
      gap: spacing[4],
      borderRadius: radius.xs,
      textStyle: typography.heading.lg,
    };
  }

  return {
    width: 44,
    height: 56,
    gap: spacing[4],
    borderRadius: radius.xs,
    textStyle: typography.heading.md,
  };
}

export function resolveOtpCellVisualRecipe({
  status,
  focused,
  filled,
  disabled,
}: {
  status: OtpFieldStatus;
  focused: boolean;
  filled: boolean;
  disabled: boolean;
}) {
  const isError = status === 'error';

  return {
    backgroundColor: filled
      ? semanticColors.background.surfaceSubtle
      : semanticColors.background.surfaceElevated,
    borderColor: isError
      ? semanticColors.border.error
      : focused
      ? semanticColors.border.accent
      : semanticColors.border.subtle,
    borderWidth: focused || isError ? borderWidth.medium : borderWidth.thin,
    opacity: disabled ? 0.5 : 1,
    textColor: isError
      ? semanticColors.text.error
      : semanticColors.text.primary,
  };
}
