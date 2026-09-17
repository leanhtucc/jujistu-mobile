import {
  borderWidth,
  fontFamilies,
  radius,
  semanticColors,
  spacing,
} from '@jujistu/shared/theme';

import type {
  AnswerOptionSize,
  AnswerOptionState,
} from './answer-option.types';

export interface AnswerOptionSizeRecipe {
  minHeight: number;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  iconSize: number;
  paddingHorizontal: number;
  paddingTop: number;
  paddingBottom: number;
  gap: number;
  borderRadius: number;
  borderWidth: number;
}

export interface AnswerOptionColors {
  backgroundColor: string;
  borderColor: string;
  contentColor: string;
}

export const answerOptionSizeRecipes: Record<
  AnswerOptionSize,
  AnswerOptionSizeRecipe
> = {
  medium: {
    minHeight: 44,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.primary.medium,
    iconSize: 20,
    paddingHorizontal: 20,
    paddingTop: spacing[6],
    paddingBottom: spacing[6],
    gap: spacing[2],
    borderRadius: radius.md,
    borderWidth: borderWidth.medium,
  },
  large: {
    minHeight: 56,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.primary.medium,
    iconSize: 20,
    paddingHorizontal: 20,
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
    gap: spacing[2],
    borderRadius: radius.md,
    borderWidth: borderWidth.medium,
  },
};

/**
 * Resolves visual colors for AnswerOption based on state.
 *
 * NOTE ON STATUS MAPPINGS:
 * JUJISTU semantic tokens currently define error (`semanticColors.border.error` / `text.error`),
 * but do not define approved semantic tokens for success or warning.
 * Per Phase 8 constraints:
 * - 'error': styled faithfully with JUJISTU error tokens.
 * - 'focus' | 'selected': styled with JUJISTU accent tokens (`border.accent`, `surfaceSubtle`).
 * - 'success' & 'warning': state structure supported; falls back to explicit neutral styling
 *   pending token approval rather than incorrectly sharing the brand accent color.
 * - 'disabled': styled with `surface`, `border.default`, `text.tertiary`, `opacity.disabled`.
 * - 'default': styled with `surface`, `border.strong`, `text.primary`.
 */
export function resolveAnswerOptionColors(
  state: AnswerOptionState,
): AnswerOptionColors {
  switch (state) {
    case 'focus':
    case 'selected':
      return {
        backgroundColor: semanticColors.background.surfaceSubtle,
        borderColor: semanticColors.border.accent,
        contentColor: semanticColors.text.accent,
      };
    case 'error':
      return {
        backgroundColor: semanticColors.background.surface,
        borderColor: semanticColors.border.error,
        contentColor: semanticColors.text.error,
      };
    case 'success':
    case 'warning':
      // Unresolved status color mapping: explicit neutral fallback
      return {
        backgroundColor: semanticColors.background.surface,
        borderColor: semanticColors.border.strong,
        contentColor: semanticColors.text.primary,
      };
    case 'disabled':
      return {
        backgroundColor: semanticColors.background.surface,
        borderColor: semanticColors.border.default,
        contentColor: semanticColors.text.tertiary,
      };
    case 'default':
    default:
      return {
        backgroundColor: semanticColors.background.surface,
        borderColor: semanticColors.border.strong,
        contentColor: semanticColors.text.primary,
      };
  }
}

export function resolveAnswerOptionEffectiveState({
  state,
  selected,
  disabled,
}: {
  state?: AnswerOptionState;
  selected?: boolean;
  disabled?: boolean;
}): AnswerOptionState {
  if (disabled || state === 'disabled') {
    return 'disabled';
  }
  if (state && state !== 'default') {
    return state;
  }
  if (selected) {
    return 'selected';
  }
  return 'default';
}
