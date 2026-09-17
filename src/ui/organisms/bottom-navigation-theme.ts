import {
  primitiveColors,
  semanticColors,
  spacing,
  typography,
} from '@jujistu/shared/theme';

/**
 * Bottom Navigation bar geometry constants.
 *
 * Canonical Figma source: NwZDju5WlLK9Ltxd7nYLnt — component set 25063:61935
 * Master frame: 390 × 82. Visual bar (before safe area): 62px.
 *
 * Safe area: PARENT_OWNS_SAFE_AREA. This component renders only the visual
 * bar. The parent navigator/wrapper must supply bottom inset.
 */
export const BOTTOM_NAV_THEME = {
  /** #000000 — Figma canonical bar background. */
  backgroundColor: primitiveColors.neutral[1000],
  /** 1px rgba(255,255,255,0.10) — Figma top divider. */
  topBorderColor: semanticColors.border.subtle,
  topBorderWidth: 1,
  /** 8px top padding from Figma geometry (8 + 36-slot + 18 label = 62 visual). */
  paddingTop: spacing[4],
  /** 0 — safe area not owned by this component. */
  paddingBottom: 0,
  /** 16px horizontal padding from Figma. */
  paddingHorizontal: spacing[8],
  /** 12px gap between item columns from Figma. */
  itemGap: spacing[6],
} as const;

/**
 * Fixed 36 × 36 icon slot that every tab item reserves regardless of the
 * active/inactive PNG image dimensions. Prevents state-switch layout shifts.
 */
export const BOTTOM_NAV_ICON_SLOT = {
  width: 36,
  height: 36,
} as const;

/**
 * Active label gradient — Figma canonical: #A70100 → #FE8B33, left-to-right.
 * Same brand gradient family as AppButton primary.
 */
export const BOTTOM_NAV_ACTIVE_LABEL_GRADIENT = {
  id: 'bottom-nav-active-label-gradient',
  x1: '0',
  x2: '1',
  y1: '0',
  y2: '0',
  colorLeft: '#A70100',
  colorRight: primitiveColors.orange[500],
} as const;

/** Inactive label color — Figma canonical: #7D7F84 (neutral.300 / text.tertiary). */
export const BOTTOM_NAV_INACTIVE_LABEL_COLOR = semanticColors.text.tertiary; // #7D7F84

/**
 * Tab label typography — Figma: Barlow Regular 12/18 ls=0.
 * Resolved from typography.body.sm which is an exact match.
 */
export const BOTTOM_NAV_LABEL_STYLE = {
  ...typography.body.sm,
  textAlign: 'center' as const,
} as const;
