import type { BottomNavigationIconNameSource } from '@jujistu/ui';

/**
 * Both visual states (active and inactive) for a product tab destination.
 * Uses the SVG/AppIcon icon slot (BottomNavigationIconNameSource).
 */
export interface ProductTabIconAsset {
  readonly active: BottomNavigationIconNameSource;
  readonly inactive: BottomNavigationIconNameSource;
}

/**
 * Canonical product-level tab asset keys for the five bottom navigation destinations.
 * These are asset identifiers, not route names.
 */
export type TabIconAssetKey =
  | 'home'
  | 'tournament'
  | 'shop'
  | 'athletes'
  | 'mission'
  | 'friends';

/**
 * Static product Bottom Navigation icon asset configuration.
 *
 * Maps each of the 5 mobile destinations to its active and inactive AppIcon
 * glyph name and verified logical render size from Figma NwZDju5WlLK9Ltxd7nYLnt.
 *
 * FIXED_VISUAL glyphs (home, tournament, mission active/inactive) embed Figma
 * raster artwork — they ignore the `color` prop.
 *
 * MONOCHROME_VECTOR glyphs (shop, athletes, friends) receive `color` to distinguish
 * active (#FE8B33 orange) from inactive (#CCD5E6 grey).
 * Legacy PNG paths and assets have been removed; bottom nav uses SVG-backed AppIcon exclusively.
 */

/** Inactive grey forwarded to MONOCHROME_VECTOR tab icons, matching text inactive color (#7D7F84). */
const INACTIVE_COLOR = '#7D7F84';

export const TAB_ICON_ASSETS: Readonly<
  Record<TabIconAssetKey, ProductTabIconAsset>
> = {
  home: {
    active: { iconName: 'houseFill', size: 24, color: '#FFFFFF' },
    inactive: { iconName: 'house', size: 24, color: INACTIVE_COLOR },
  },
  shop: {
    active: { iconName: 'storefrontFill', size: 24, color: '#FFFFFF' },
    inactive: { iconName: 'storefront', size: 24, color: INACTIVE_COLOR },
  },
  tournament: {
    active: { iconName: 'trophyFill', size: 24, color: '#FFFFFF' },
    inactive: { iconName: 'trophy', size: 24, color: INACTIVE_COLOR },
  },
  athletes: {
    active: { iconName: 'pathFill', size: 24, color: '#FFFFFF' },
    inactive: { iconName: 'path', size: 24, color: INACTIVE_COLOR },
  },
  mission: {
    active: { iconName: 'targetFill', size: 24, color: '#FFFFFF' },
    inactive: { iconName: 'target', size: 24, color: INACTIVE_COLOR },
  },
  friends: {
    active: { iconName: 'usersThree', size: 24, color: '#FFFFFF' },
    inactive: { iconName: 'usersThree', size: 24, color: INACTIVE_COLOR },
  },
} as const;
