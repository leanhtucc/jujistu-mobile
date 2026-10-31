import type { BottomNavigationItemData } from '@jujistu/ui';

import { TAB_ICON_ASSETS } from './tab-icon-assets';

export const BOTTOM_NAVIGATION_ITEMS = [
  {
    key: 'home',
    label: 'Trang chủ',
    activeIcon: TAB_ICON_ASSETS.home.active,
    inactiveIcon: TAB_ICON_ASSETS.home.inactive,
  },
  {
    key: 'shop',
    label: 'Shop',
    activeIcon: TAB_ICON_ASSETS.shop.active,
    inactiveIcon: TAB_ICON_ASSETS.shop.inactive,
  },
  {
    key: 'tournament',
    label: 'Giải đấu',
    activeIcon: TAB_ICON_ASSETS.tournament.active,
    inactiveIcon: TAB_ICON_ASSETS.tournament.inactive,
  },
  {
    key: 'athletes',
    label: 'VĐV',
    activeIcon: TAB_ICON_ASSETS.athletes.active,
    inactiveIcon: TAB_ICON_ASSETS.athletes.inactive,
  },
  {
    key: 'mission',
    label: 'Nhiệm vụ',
    activeIcon: TAB_ICON_ASSETS.mission.active,
    inactiveIcon: TAB_ICON_ASSETS.mission.inactive,
  },
] as const satisfies ReadonlyArray<BottomNavigationItemData>;

export type BottomNavigationProductKey =
  (typeof BOTTOM_NAVIGATION_ITEMS)[number]['key'];
