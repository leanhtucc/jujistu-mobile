import type { ImageSourcePropType } from 'react-native';

/**
 * Immutable configuration for a single tab state image asset
 * with verified Figma logical render dimensions.
 */
export interface TabImageAsset {
  readonly source: ImageSourcePropType;
  readonly width: number;
  readonly height: number;
}

/**
 * Both visual states (active and inactive) for a product tab destination.
 */
export interface ProductTabIconAsset {
  readonly active: TabImageAsset;
  readonly inactive: TabImageAsset;
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
 * Maps each of the 5 mobile destinations to its active and inactive PNG image
 * source and verified logical render dimensions from Figma file NwZDju5WlLK9Ltxd7nYLnt.
 *
 * NOTE: AppIcon remains strictly for vector glyphs (chevronLeft, logOut).
 * Product tab image assets are consumed by the product navigation layer.
 */
export const TAB_ICON_ASSETS: Readonly<
  Record<TabIconAssetKey, ProductTabIconAsset>
> = {
  home: {
    active: {
      source: require('../../../assets/icons/tabs/home-active.png'),
      width: 27,
      height: 23,
    },
    inactive: {
      source: require('../../../assets/icons/tabs/home-inactive.png'),
      width: 27,
      height: 23,
    },
  },
  tournament: {
    active: {
      source: require('../../../assets/icons/tabs/tournament-active.png'),
      width: 36,
      height: 20,
    },
    inactive: {
      source: require('../../../assets/icons/tabs/tournament-inactive.png'),
      width: 36,
      height: 20,
    },
  },
  shop: {
    active: {
      source: require('../../../assets/icons/tabs/shop-active.png'),
      width: 20,
      height: 20,
    },
    inactive: {
      source: require('../../../assets/icons/tabs/shop-inactive.png'),
      width: 20,
      height: 20,
    },
  },
  mission: {
    active: {
      source: require('../../../assets/icons/tabs/mission-active.png'),
      width: 26,
      height: 26,
    },
    inactive: {
      source: require('../../../assets/icons/tabs/mission-inactive.png'),
      width: 26,
      height: 24,
    },
  },
  friends: {
    active: {
      source: require('../../../assets/icons/tabs/friends-active.png'),
      width: 24,
      height: 22,
    },
    inactive: {
      source: require('../../../assets/icons/tabs/friends-inactive.png'),
      width: 24,
      height: 22,
    },
  },
} as const;
