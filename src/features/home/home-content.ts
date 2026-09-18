import type { IconName } from '@jujistu/ui';
import type { ImageSourcePropType } from 'react-native';

export interface HomeNewsItem {
  readonly id: string;
  readonly image: ImageSourcePropType;
  readonly title: string;
}

export interface HomeQuickAction {
  readonly key: string;
  readonly label: string;
  readonly icon: IconName;
  readonly iconSize: number;
}

export const HOME_BANNERS = {
  previous: require('../../../assets/image/banners/banner_home_01.png'),
  active: require('../../../assets/image/banners/banner_home_02.png'),
  next: require('../../../assets/image/banners/banner_home_03.png'),
} as const;

export const HOME_NEWS: ReadonlyArray<HomeNewsItem> = [
  {
    id: 'tran-quoc-tuan',
    image: require('../../../assets/image/news/news_01.png'),
    title: 'Bước lùi này không khiến cho Trần Quốc Tuấn lệch hướng',
  },
  {
    id: 'pham-van-hao-tran-van-trong',
    image: require('../../../assets/image/news/news_02.png'),
    title: 'Phạm Văn Hào 2 - 0 Trần Văn Trọng',
  },
];

export const HOME_QUICK_ACTIONS = {
  left: [
    { key: 'club', label: 'CLUB', icon: 'club', iconSize: 34 },
    {
      key: 'leaderboard',
      label: 'Leaderboard',
      icon: 'leaderboard',
      iconSize: 42,
    },
    {
      key: 'mma-academy',
      label: 'Học viện MMA',
      icon: 'mmaAcademy',
      iconSize: 34,
    },
  ],
  right: [
    { key: 'gift', label: 'Gift', icon: 'gift', iconSize: 34 },
    { key: 'live', label: 'LIVE', icon: 'live', iconSize: 40 },
    { key: 'minigame', label: 'Minigame', icon: 'minigame', iconSize: 34 },
  ],
} as const satisfies Record<'left' | 'right', ReadonlyArray<HomeQuickAction>>;
