import {
  radius,
  semanticColors,
  spacing,
  typography,
} from '@jujistu/shared/theme';

import type { IconName } from '../atoms/icon';
import type { HeaderBackground } from './header.types';

export const HEADER_THEME = {
  height: 56,
  paddingHorizontal: spacing[8], // 16
  paddingVertical: spacing[4], // 8
  gap: spacing[6], // 12
  borderRadius: radius.none, // 0
} as const;

export const HEADER_ACTION_THEME = {
  width: 40,
  height: 40,
  padding: spacing[2], // 4
  borderRadius: radius.xs, // 4
} as const;

export const HEADER_ACTION_INSIDE_STROKE = {
  strokeWidth: 1,
  inset: 0.5,
  innerRadius: 3.5, // radius.xs (4) - strokeWidth / 2 (0.5)
} as const;

export const RAW_FIGMA_HEADER_ACTION_GRADIENT_TRANSFORM = [
  [6.123234262925839e-17, 1, 0],
  [-1, 6.123234262925839e-17, 1],
] as const;

export const HEADER_ACTION_GRADIENT = {
  rawTransform: RAW_FIGMA_HEADER_ACTION_GRADIENT_TRANSFORM,
  // Figma's two affine rows [a, c, tx] and [b, d, ty] converted to SVG's column-major matrix [a, b, c, d, tx, ty]
  transform: [
    6.123234262925839e-17, -1, 1, 6.123234262925839e-17, 0, 1,
  ] as const,
  stops: [
    { offset: 0, opacity: 0.10000000149011612 },
    { offset: 0.6477574110031128, opacity: 0.019999999552965164 },
    { offset: 1, opacity: 0.20000000298023224 },
  ] as const,
} as const;

export const HEADER_ICON_SIZES: Record<IconName, number> = {
  chevronLeft: 24,
  logOut: 20,
};

export function resolveHeaderIconSize(icon: IconName): number {
  if (icon === 'logOut') {
    return HEADER_ICON_SIZES.logOut;
  }
  return HEADER_ICON_SIZES.chevronLeft;
}

export function resolveHeaderBackgroundColor(
  background: HeaderBackground = 'solid',
): string {
  if (background === 'transparent') {
    return 'transparent';
  }
  return semanticColors.background.canvas; // #0C0C0C
}

export const HEADER_TITLE_STYLE = {
  ...typography.label.lg,
  color: semanticColors.text.primary,
  textAlign: 'center' as const,
};
