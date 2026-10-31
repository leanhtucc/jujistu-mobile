import type {
  MissionDefinition,
  MissionProgress,
  MissionTab,
} from '../types/mission.types';

/**
 * Static content for the v4 prototype (Phase 1). Replaced by feature hooks and
 * services when the mission API is available. The prediction and quiz missions
 * of the full prototype are outside Phase 1 and therefore omitted.
 */

export const INITIAL_COINS = 12_500;

/** Seconds until the missions refresh, at the moment the screen opens. */
export const INITIAL_REFRESH_SECONDS = 16_071;

export const WEEK_MISSION_TOTAL = 12;
/** Weekly missions already completed before today's, per the prototype. */
export const WEEK_BASE_DONE = 4;

export const DAILY_MISSIONS: readonly MissionDefinition[] = [
  {
    id: 'login',
    icon: 'calendarCheck',
    title: 'Đăng nhập hôm nay',
    reward: 50,
    target: 1,
  },
  {
    id: 'video',
    icon: 'playCirclePhosphor',
    title: 'Xem 2 video giải đấu trên YouTube',
    reward: 100,
    target: 2,
  },
  {
    id: 'live5',
    icon: 'live',
    title: 'Xem livestream giải 5 phút',
    reward: 100,
    target: 0,
  },
  {
    id: 'rules',
    icon: 'medal',
    title: 'Đọc luật thi đấu Newaza',
    reward: 60,
    target: 1,
  },
];

export const WEEKLY_MISSIONS: readonly MissionDefinition[] = [
  {
    id: 'w1',
    icon: 'path',
    title: 'Xem hành trình 5 vận động viên',
    reward: 300,
    target: 5,
  },
  {
    id: 'w3',
    icon: 'storefront',
    title: 'Mua 1 sản phẩm tại Shop',
    reward: 200,
    target: 1,
  },
];

export const MISSIONS_BY_TAB: Record<MissionTab, readonly MissionDefinition[]> =
  {
    today: DAILY_MISSIONS,
    week: WEEKLY_MISSIONS,
  };

export const INITIAL_MISSION_PROGRESS: Record<string, MissionProgress> = {
  login: { progress: 1, status: 'claimable', busy: false },
  video: { progress: 1, status: 'todo', busy: false },
  live5: { progress: 0, status: 'pending', busy: false },
  rules: { progress: 1, status: 'claimed', busy: false },
  w1: { progress: 3, status: 'todo', busy: false },
  w3: { progress: 1, status: 'claimed', busy: false },
};

export const MISSION_TABS: readonly {
  readonly key: MissionTab;
  readonly label: string;
}[] = [
  { key: 'today', label: 'Hôm nay' },
  { key: 'week', label: 'Tuần này' },
];

/** Coins for each of the seven login-streak days. */
export const STREAK_REWARDS: readonly number[] = [10, 10, 20, 20, 30, 30, 100];

/** Days already completed before today's claim. */
export const STREAK_BASE_DONE = 4;

export const STREAK_CLAIM_REWARD = 30;
