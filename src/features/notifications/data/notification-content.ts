import type { NotificationItem } from '../types/notification.types';

/**
 * Static notifications for the v4 prototype (Phase 1). Replaced by a feature
 * hook backed by the notification service when the API is available.
 */
export const NOTIFICATIONS: readonly NotificationItem[] = [
  {
    id: 'final-starts',
    icon: 'playCirclePhosphor',
    title: 'Chung kết NoGi 69 kg bắt đầu lúc 20:00 · Thảm 1',
    timeLabel: 'Vừa xong',
    target: {
      type: 'tournament',
      tournamentId: 'nat26',
      tab: 'Lịch thi đấu',
    },
  },
  {
    id: 'login-coins',
    icon: 'coinsPhosphor',
    title: 'Bạn còn Xu đăng nhập hôm nay chưa nhận',
    timeLabel: '2 giờ trước',
    target: { type: 'missions' },
  },
  {
    id: 'order-shipping',
    icon: 'storefront',
    title: 'Đơn #JJ-2026-0139 đang được giao',
    timeLabel: 'Hôm qua',
    target: { type: 'shop' },
  },
];
