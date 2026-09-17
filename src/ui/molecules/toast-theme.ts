import {
  fontFamilies,
  radius,
  semanticColors,
  spacing,
} from '@jujistu/shared/theme';

import type { ToastStatus, ToastStyleVariant } from './toast.types';

export interface ToastColors {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  textColor: string;
  titleColor: string;
  iconColor: string;
}

/**
 * Explicitly documented unresolved status mappings in the JUJISTU Design System.
 *
 * JUJISTU semantic tokens currently define error (`semanticColors.status.error` / `border.error` / `text.error`),
 * but do NOT define approved semantic tokens for success, warning, or information.
 *
 * Per Phase 8 Batch 8.5 constraints:
 * - 'error' is styled with approved error tokens.
 * - 'neutral' is styled with approved neutral surface/text tokens.
 * - 'success', 'warning', 'information' fall back to approved neutral styling,
 *   retaining the underlying component structure while visually marked as unresolved.
 * - Brand accent is NOT used as an invented success/warning color.
 */
export const unresolvedToastStatuses = new Set<ToastStatus>([
  'success',
  'warning',
  'information',
]);

export function isToastStatusUnresolved(status: ToastStatus): boolean {
  return unresolvedToastStatuses.has(status);
}

export function resolveToastColors(
  status: ToastStatus = 'neutral',
  styleVariant: ToastStyleVariant = 'style1',
): ToastColors {
  const isPush = styleVariant === 'style2' || styleVariant === 'push';

  if (status === 'error') {
    if (isPush) {
      return {
        backgroundColor: semanticColors.status.error,
        borderWidth: 0,
        textColor: semanticColors.text.primary,
        titleColor: semanticColors.text.primary,
        iconColor: semanticColors.text.primary,
      };
    }
    return {
      backgroundColor: semanticColors.background.surface,
      borderColor: semanticColors.border.error,
      borderWidth: 1,
      textColor: semanticColors.text.error,
      titleColor: semanticColors.text.error,
      iconColor: semanticColors.text.error,
    };
  }

  // neutral (and documented neutral fallback for unresolved success/warning/information)
  if (isPush) {
    return {
      backgroundColor: semanticColors.background.surfaceElevated,
      borderColor: semanticColors.border.strong,
      borderWidth: 1,
      textColor: semanticColors.text.primary,
      titleColor: semanticColors.text.primary,
      iconColor: semanticColors.text.primary,
    };
  }

  return {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.strong,
    borderWidth: 1,
    textColor: semanticColors.text.secondary,
    titleColor: semanticColors.text.primary,
    iconColor: semanticColors.text.primary,
  };
}

export const toastTheme = {
  borderRadius: radius.md, // 8
  paddingHorizontal: spacing[8], // 16
  paddingVertical: spacing[6], // 12
  gap: spacing[4], // 8
  titleFontFamily: fontFamilies.primary.semiBold,
  messageFontFamily: fontFamilies.primary.regular,
};
