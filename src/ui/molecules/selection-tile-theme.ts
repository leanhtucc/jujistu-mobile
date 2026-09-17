import {
  borderWidth,
  fontFamilies,
  fontSizes,
  fontWeights,
  radius,
  semanticColors,
  spacing,
} from '@jujistu/shared/theme';

import type {
  SelectionTileState,
  SelectionTileTitleWeight,
} from './selection-tile.types';

export interface SelectionTileColors {
  background: string;
  border: string;
  titleText: string;
  helperText: string;
  badgeBackground: string;
  badgeText: string;
}

export const SELECTION_TILE_THEME = {
  minHeight: 64,
  borderRadius: radius.md,
  borderWidth: borderWidth.medium,
  paddingLeft: 20,
  paddingRight: spacing[6],
  paddingVertical: spacing[6],
  gap: spacing[6],
  leadingSize: 40,
} as const;

/**
 * Resolves visual colors for SelectionTile based on state.
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
export function resolveSelectionTileColors(
  state: SelectionTileState,
): SelectionTileColors {
  switch (state) {
    case 'focus':
    case 'selected':
      return {
        background: semanticColors.background.surfaceSubtle,
        border: semanticColors.border.accent,
        titleText: semanticColors.text.primary,
        helperText: semanticColors.text.accent,
        badgeBackground: semanticColors.background.surfaceElevated,
        badgeText: semanticColors.text.accent,
      };
    case 'error':
      return {
        background: semanticColors.background.surface,
        border: semanticColors.border.error,
        titleText: semanticColors.text.error,
        helperText: semanticColors.text.error,
        badgeBackground: semanticColors.background.surfaceElevated,
        badgeText: semanticColors.text.error,
      };
    case 'success':
    case 'warning':
      // Unresolved status color mapping: explicit neutral fallback
      return {
        background: semanticColors.background.surface,
        border: semanticColors.border.strong,
        titleText: semanticColors.text.primary,
        helperText: semanticColors.text.tertiary,
        badgeBackground: semanticColors.background.surfaceElevated,
        badgeText: semanticColors.text.accent,
      };
    case 'disabled':
      return {
        background: semanticColors.background.surface,
        border: semanticColors.border.default,
        titleText: semanticColors.text.tertiary,
        helperText: semanticColors.text.tertiary,
        badgeBackground: semanticColors.background.surface,
        badgeText: semanticColors.text.tertiary,
      };
    case 'default':
    default:
      return {
        background: semanticColors.background.surface,
        border: semanticColors.border.strong,
        titleText: semanticColors.text.primary,
        helperText: semanticColors.text.tertiary,
        badgeBackground: semanticColors.background.surfaceElevated,
        badgeText: semanticColors.text.accent,
      };
  }
}

export function resolveSelectionTileTitleStyle(
  weight: SelectionTileTitleWeight,
) {
  return {
    fontFamily:
      weight === 'semibold'
        ? fontFamilies.primary.semiBold
        : fontFamilies.primary.medium,
    fontSize: fontSizes[14],
    fontWeight:
      weight === 'semibold' ? fontWeights.semiBold : fontWeights.medium,
    lineHeight: 20,
  };
}

export function resolveSelectionTileEffectiveState({
  state,
  checked,
  selected,
  disabled,
}: {
  state?: SelectionTileState;
  checked?: boolean;
  selected?: boolean;
  disabled?: boolean;
}): SelectionTileState {
  if (disabled || state === 'disabled') {
    return 'disabled';
  }
  if (state && state !== 'default') {
    return state;
  }
  if (checked || selected) {
    return 'selected';
  }
  return 'default';
}
