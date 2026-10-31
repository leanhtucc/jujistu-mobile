import type { ImageSourcePropType } from 'react-native';
import type { IconName } from '@jujistu/ui';

export type HomeMode = 'guest' | 'authenticated';

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

export interface HomeHeroSlide {
  readonly id: string;
  readonly tag: string;
  readonly tagVariant: 'accent' | 'neutral' | 'solid';
  readonly title: string;
  readonly meta: string;
  readonly image: ImageSourcePropType;
  readonly actionType: 'youtube' | 'athlete' | 'shop' | 'tournament';
}

export interface HomeShortcut {
  readonly key:
    | 'tournaments'
    | 'results'
    | 'tickets'
    | 'videos'
    | 'clubs'
    | 'rankings'
    | 'minigame';
  readonly label: string;
  readonly iconName: IconName;
}

export interface UpcomingCountdown {
  readonly days: string;
  readonly hours: string;
  readonly minutes: string;
  readonly seconds: string;
}

export interface HomeUpcomingTournament {
  readonly id: string;
  readonly overline: string;
  readonly name: string;
  readonly venue: string;
  readonly ticketNotice: string;
  readonly countdown: UpcomingCountdown;
  readonly banner: ImageSourcePropType;
}

export interface StandingRow {
  readonly rank: string;
  readonly team: string;
  readonly gold: number;
  readonly silver: number;
  readonly bronze: number;
}

export interface HomeRecentRecap {
  readonly id: string;
  readonly overline: string;
  readonly name: string;
  readonly standings: ReadonlyArray<StandingRow>;
}

export interface TicketZone {
  readonly name: string;
  readonly left: number;
  readonly total: number;
  readonly percent: number;
  readonly isLow: boolean;
}

export interface TicketSession {
  readonly id: string;
  readonly date: string;
  readonly dayOfWeek: string;
  readonly title: string;
  readonly shortKind: string;
  readonly time: string;
  readonly openTime: string;
  readonly venue: string;
  readonly fromPrice: number;
  readonly zones: ReadonlyArray<TicketZone>;
}

export interface HomeAthleteSpotlight {
  readonly id: string;
  readonly overline: string;
  readonly name: string;
  readonly career: string;
  readonly belt: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  readonly degrees: number;
  readonly image: ImageSourcePropType;
}

export interface HomeAthleteInfo {
  readonly name: string;
  readonly team: string;
  readonly belt: string;
  readonly weight: string;
  readonly image: ImageSourcePropType;
}

export interface HomeFeaturedMatch {
  readonly id: string;
  readonly title: string;
  readonly tournamentName: string;
  readonly timeText: string;
  readonly arenaImage: ImageSourcePropType;
  readonly athleteA: HomeAthleteInfo;
  readonly athleteB: HomeAthleteInfo;
  readonly secondsRemaining: number;
}

export interface HomeTournamentFocus {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly days: string;
  readonly stats: ReadonlyArray<[string, string]>;
  readonly poster: ImageSourcePropType;
}

export interface HomeProductHighlight {
  readonly id: string;
  readonly name: string;
  readonly sub: string;
  readonly price: number;
  readonly oldPrice?: number;
  readonly tag?: string;
  readonly image: ImageSourcePropType;
}

export interface HomeVideoItem {
  readonly id: string;
  readonly title: string;
  readonly duration?: string;
  readonly meta?: string;
  readonly isLive?: boolean;
  readonly image: ImageSourcePropType;
}

export interface HomeNewsItem {
  readonly id: string;
  readonly category?: string;
  readonly title?: string;
  readonly description: string;
  readonly date: string;
  readonly image: ImageSourcePropType;
}

export const HOME_OVERLINE = 'THỨ TƯ · 07/10';
export const USER_GREETING = 'Chào, Minh';

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

export function getHomeQuickActions(
  _mode: HomeMode = 'authenticated',
): ReadonlyArray<HomeQuickAction> {
  return HOME_QUICK_ACTIONS;
}

export const HOME_SHORTCUTS: ReadonlyArray<HomeShortcut> = [
  {
    key: 'tournaments',
    label: 'Lịch giải',
    iconName: 'calendarCheck',
  },
  {
    key: 'results',
    label: 'Kết quả',
    iconName: 'medal',
  },
  {
    key: 'tickets',
    label: 'Vé',
    iconName: 'ticket',
  },
  {
    key: 'videos',
    label: 'Video',
    iconName: 'youtubeLogo',
  },
  {
    key: 'clubs',
    label: 'CLB',
    iconName: 'usersThree',
  },
  {
    key: 'rankings',
    label: 'BXH',
    iconName: 'ranking',
  },
  {
    key: 'minigame',
    label: 'Mini game',
    iconName: 'gameController',
  },
];

export const HOME_UPCOMING_TOURNAMENT: HomeUpcomingTournament = {
  id: 'cup-hanoi-2026',
  overline: 'GIẢI TIẾP THEO · MỞ RỘNG',
  name: 'Cúp Jujitsu Hà Nội mở rộng 2026',
  venue: 'Nhà thi đấu Trịnh Hoài Đức · Hà Nội · 24–26/10',
  ticketNotice: 'Vé đã mở bán · từ 150.000₫',
  countdown: {
    days: '16',
    hours: '12',
    minutes: '13',
    seconds: '08',
  },
  banner: require('../../../../assets/image/events/cup_hanoi_arena.jpg'),
};

export const HOME_RECENT_RECAP: HomeRecentRecap = {
  id: 'nat26-recap',
  overline: 'VỪA KẾT THÚC · 30/09',
  name: 'Giải vô địch Jujitsu Quốc gia 2026',
  standings: [
    { rank: '1', team: 'Thái Nguyên', gold: 11, silver: 8, bronze: 7 },
    { rank: '2', team: 'TP.HCM', gold: 7, silver: 10, bronze: 15 },
    { rank: '3', team: 'Hà Nội', gold: 6, silver: 4, bronze: 5 },
  ],
};

export const HOME_HERO_SLIDES: ReadonlyArray<HomeHeroSlide> = [
  {
    id: 'hero-faceoff',
    tag: 'SẮP DIỄN RA',
    tagVariant: 'accent',
    title: 'Cúp Hà Nội mở rộng 24–26/10',
    meta: 'Vé đã mở bán · từ 150.000đ',
    image: require('../../../../assets/image/banners/hero_faceoff.jpg'),
    actionType: 'tournament',
  },
  {
    id: 'hero-live-finals',
    tag: 'TRỰC TIẾP',
    tagVariant: 'accent',
    title: 'Chung kết Newaza NoGi tối nay',
    meta: 'YouTube · Jujitsu Việt Nam TV',
    image: require('../../../../assets/image/banners/hero_live_finals.jpg'),
    actionType: 'youtube',
  },
  {
    id: 'hero-shop-gi',
    tag: 'SHOP',
    tagVariant: 'solid',
    title: 'Gi Sen Vàng Pro đã lên kệ',
    meta: 'Giảm 15% trong tháng 10',
    image: require('../../../../assets/image/banners/hero_shop_gi.jpg'),
    actionType: 'shop',
  },
];

export const HOME_TICKET_SESSIONS: ReadonlyArray<TicketSession> = [
  {
    id: 'sess-1',
    date: '24/10',
    dayOfWeek: 'THỨ BẢY',
    title: 'Ngày 1 · Newaza Gi',
    shortKind: 'Newaza Gi',
    time: '08:00',
    openTime: '07:30',
    venue: 'Nhà thi đấu Trịnh Hoài Đức · Hà Nội',
    fromPrice: 150000,
    zones: [
      { name: 'VIP sát thảm', left: 12, total: 50, percent: 24, isLow: false },
      { name: 'Khán đài A', left: 28, total: 67, percent: 42, isLow: false },
      {
        name: 'Khán đài B · C',
        left: 312,
        total: 390,
        percent: 80,
        isLow: false,
      },
    ],
  },
  {
    id: 'sess-2',
    date: '25/10',
    dayOfWeek: 'CHỦ NHẬT',
    title: 'Ngày 2 · Newaza NoGi',
    shortKind: 'Newaza NoGi',
    time: '08:00',
    openTime: '07:30',
    venue: 'Nhà thi đấu Trịnh Hoài Đức · Hà Nội',
    fromPrice: 150000,
    zones: [
      { name: 'VIP sát thảm', left: 10, total: 50, percent: 20, isLow: false },
      { name: 'Khán đài A', left: 24, total: 67, percent: 36, isLow: false },
      {
        name: 'Khán đài B · C',
        left: 271,
        total: 390,
        percent: 70,
        isLow: false,
      },
    ],
  },
  {
    id: 'sess-3',
    date: '26/10',
    dayOfWeek: 'THỨ HAI',
    title: 'Đêm chung kết · Duo',
    shortKind: 'Chung kết',
    time: '18:30',
    openTime: '17:45',
    venue: 'Nhà thi đấu Trịnh Hoài Đức · Hà Nội',
    fromPrice: 200000,
    zones: [
      { name: 'VIP sát thảm', left: 4, total: 50, percent: 8, isLow: true },
      { name: 'Khán đài A', left: 15, total: 67, percent: 22, isLow: false },
      {
        name: 'Khán đài B · C',
        left: 38,
        total: 390,
        percent: 10,
        isLow: false,
      },
    ],
  },
];

export const HOME_ATHLETE_SPOTLIGHT: HomeAthleteSpotlight = {
  id: 'ath-duc-anh',
  overline: 'HÀNH TRÌNH VĐV',
  name: 'Trần Đức Anh',
  career: '10 năm · 65 trận · 10 HCV',
  belt: 'brown',
  degrees: 2,
  image: require('../../../../assets/image/avatars/athlete_ducanh_action.jpg'),
};

export const HOME_FEATURED_MATCH: HomeFeaturedMatch = {
  id: 'match-nat26-nogi-69',
  title: 'Chung kết Newaza NoGi · Nam 69 kg',
  tournamentName: 'Giải vô địch Jujitsu Quốc gia 2026 · Đà Nẵng',
  timeText: 'Chung kết · 20:00',
  arenaImage: require('../../../../assets/image/events/match_finals_arena.jpg'),
  athleteA: {
    name: 'Trần Đức Anh',
    team: 'Đoàn Hà Nội',
    belt: 'Đai Nâu',
    weight: '69 kg',
    image: require('../../../../assets/image/avatars/athlete_tran_duc_anh.jpg'),
  },
  athleteB: {
    name: 'Đặng Minh Khoa',
    team: 'Đoàn TP.HCM',
    belt: 'Đai Nâu',
    weight: '69 kg',
    image: require('../../../../assets/image/avatars/athlete_dang_minh_khoa.jpg'),
  },
  secondsRemaining: 1694,
};

export const HOME_TOURNAMENT_FOCUS: HomeTournamentFocus = {
  id: 'nat26',
  name: 'Giải vô địch Jujitsu Quốc gia 2026',
  location: 'Cung thể thao Tiên Sơn · Đà Nẵng',
  days: '24–30/09/2026',
  stats: [
    ['17', 'đoàn'],
    ['312', 'VĐV'],
    ['96', 'bộ huy chương'],
  ],
  poster: require('../../../../assets/image/events/national_championship_2026.jpg'),
};

export const HOME_FEATURED_PRODUCTS: ReadonlyArray<HomeProductHighlight> = [
  {
    id: 'gi-pro',
    name: 'Gi thi đấu Sen Vàng Pro',
    sub: 'Pearl weave 450 gsm · Trắng',
    price: 2450000,
    oldPrice: 2890000,
    tag: '-15%',
    image: require('../../../../assets/image/banners/hero_shop_gi.jpg'),
  },
  {
    id: 'rash',
    name: 'Rashguard Giải Quốc gia 2026',
    sub: 'Dài tay · In thăng hoa',
    price: 690000,
    tag: 'MỚI',
    image: require('../../../../assets/image/banners/hero_faceoff.jpg'),
  },
  {
    id: 'short',
    name: 'Quần grappling NoGi',
    sub: 'Co giãn 4 chiều',
    price: 550000,
    tag: 'CÒN 3',
    image: require('../../../../assets/image/banners/hero_live_finals.jpg'),
  },
];

export const HOME_FEATURED_VIDEOS: ReadonlyArray<HomeVideoItem> = [
  {
    id: 'vod-final-69',
    title: 'Chung kết NoGi 69 kg: Đức Anh vs Minh Khoa',
    duration: '07:15',
    meta: '21 N lượt xem · 7 ngày trước',
    image: require('../../../../assets/image/banners/hero_faceoff.jpg'),
  },
  {
    id: 'vod-nat-recap',
    title: 'Toàn cảnh Giải vô địch Quốc gia 2026',
    duration: '12:40',
    meta: '15 N lượt xem · 6 ngày trước',
    image: require('../../../../assets/image/events/national_arena_bg.jpg'),
  },
  {
    id: 'vod-rules',
    title: 'Newaza, Fighting, Contact khác nhau thế nào?',
    duration: '06:02',
    meta: '8,4 N lượt xem · 2 tuần trước',
    image: require('../../../../assets/image/events/cup_hanoi_arena.jpg'),
  },
];

export const HOME_NEWS: ReadonlyArray<HomeNewsItem> = [
  {
    id: 'news-nat26',
    category: 'KẾT QUẢ',
    title: 'Thái Nguyên nhất toàn đoàn Giải vô địch Quốc gia 2026',
    description: 'Thái Nguyên nhất toàn đoàn Giải vô địch Quốc gia 2026',
    date: '30/09/2026',
    image: require('../../../../assets/image/events/national_arena_bg.jpg'),
  },
  {
    id: 'news-hn26',
    category: 'GIẢI ĐẤU',
    title: 'Cúp Hà Nội mở rộng 2026 mở đăng ký từ 10/10',
    description: 'Cúp Hà Nội mở rộng 2026 mở đăng ký từ 10/10',
    date: '06/10/2026',
    image: require('../../../../assets/image/events/cup_hanoi_arena.jpg'),
  },
  {
    id: 'news-ath-da',
    category: 'HỒ SƠ',
    title: 'Trần Đức Anh: 10 năm từ CLB phường đến ngôi vô địch',
    description: 'Trần Đức Anh: 10 năm từ CLB phường đến ngôi vô địch',
    date: '02/10/2026',
    image: require('../../../../assets/image/avatars/athlete_ducanh_action.jpg'),
  },
];
