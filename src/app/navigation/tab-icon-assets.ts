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
 * MONOCHROME_VECTOR glyphs (shop, friends) receive `color` to distinguish
 * active (#FE8B33 orange) from inactive (#CCD5E6 grey).
 * Legacy PNG paths and assets have been removed; bottom nav uses SVG-backed AppIcon exclusively.
 */

/** Brand active colour forwarded to MONOCHROME_VECTOR tab icons. */
const ACTIVE_COLOR = '#FE8B33';

/** Inactive grey forwarded to MONOCHROME_VECTOR tab icons. */
const INACTIVE_COLOR = '#CCD5E6';

export const TAB_ICON_ASSETS: Readonly<
  Record<TabIconAssetKey, ProductTabIconAsset>
> = {
  home: {
    active: { iconName: 'homeActive', size: 27 },
    inactive: { iconName: 'homeInactive', size: 27 },
  },
  tournament: {
    active: { iconName: 'tournamentActive', size: 36 },
    inactive: { iconName: 'tournamentInactive', size: 36 },
  },
  shop: {
    active: { iconName: 'shopActive', size: 20, color: ACTIVE_COLOR },
    inactive: { iconName: 'shopInactive', size: 20, color: INACTIVE_COLOR },
  },
  mission: {
    active: { iconName: 'missionActive', size: 26 },
    inactive: { iconName: 'missionInactive', size: 26 },
  },
  friends: {
    active: { iconName: 'friendsActive', size: 24, color: ACTIVE_COLOR },
    inactive: { iconName: 'friendsInactive', size: 24, color: INACTIVE_COLOR },
  },
} as const;
