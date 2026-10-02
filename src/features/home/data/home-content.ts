import type { ImageSourcePropType } from 'react-native';
import type { IconName } from '@jujistu/ui';

export interface HomeQuickAction {
  readonly key:
    | 'club'
    | 'leaderboard'
    | 'event-ticket'
    | 'mma-academy'
    | 'live'
    | 'minigame';
  readonly label: string;
  readonly iconName: IconName;
  readonly iconSize: number;
}

export interface HomeEventItem {
  readonly id: string;
  readonly image: ImageSourcePropType;
  readonly ticketImage: ImageSourcePropType;
  readonly title: string;
}

export interface HomeVideoItem {
  readonly id: string;
  readonly image: ImageSourcePropType;
  readonly title: string;
}

export interface HomeNewsItem {
  readonly id: string;
  readonly date: string;
  readonly description: string;
  readonly image: ImageSourcePropType;
}

export type HomeMode = 'guest' | 'authenticated';

export const HOME_BANNERS: ReadonlyArray<ImageSourcePropType> = [
  require('../../../../assets/image/banners/banner_home_01.png'),
  require('../../../../assets/image/banners/banner_home_02.png'),
  require('../../../../assets/image/banners/banner_home_03.png'),
];

export const HOME_QUICK_ACTIONS: ReadonlyArray<HomeQuickAction> = [
  {
    key: 'club',
    label: 'Câu lạc bộ',
    iconName: 'club',
    iconSize: 25,
  },
  {
    key: 'leaderboard',
    label: 'Leaderboard',
    iconName: 'leaderboard',
    iconSize: 24,
  },
  {
    key: 'event-ticket',
    label: 'Vé sự kiện',
    iconName: 'gift',
    iconSize: 24,
  },
  {
    key: 'mma-academy',
    label: 'Học viện MMA',
    iconName: 'mmaAcademy',
    iconSize: 24,
  },
  {
    key: 'live',
    label: 'Trực tiếp',
    iconName: 'live',
    iconSize: 24,
  },
  {
    key: 'minigame',
    label: 'Mini game',
    iconName: 'minigame',
    iconSize: 24,
  },
];

export const HOME_EVENT: HomeEventItem = {
  id: 'vo-dai-vinh-quang-2026',
  image: require('../../../../assets/image/news/news_01.png'),
  ticketImage: require('../../../../assets/image/events/event-ticket.png'),
  title: 'Võ đài vinh quang - 15/10/2026',
};

export const HOME_FEATURED_VIDEOS: ReadonlyArray<HomeVideoItem> = [
  {
    id: 'tran-quoc-toan-zakhar-dzmitrychenka',
    image: require('../../../../assets/image/news/news_02.png'),
    title: 'Trần Quốc Toản Vs Zakhar Dzmitrychenka',
  },
  {
    id: 'most-fiery-faceoffs-2021',
    image: require('../../../../assets/image/news/news_01.png'),
    title: 'Most Fiery Faceoffs of 2021',
  },
];

export const HOME_NEWS: ReadonlyArray<HomeNewsItem> = [
  {
    id: 'pham-van-hao-tran-trong',
    date: '10/03/2026',
    description:
      'Phạm Văn Hào 2 - 0 Trần Trọng, chiến thắng áp đảo trong trận đấu MMA đầy kịch tính',
    image: require('../../../../assets/image/news/news_02.png'),
  },
];

export function getHomeQuickActions(
  _mode: HomeMode = 'authenticated',
): ReadonlyArray<HomeQuickAction> {
  return HOME_QUICK_ACTIONS;
}
