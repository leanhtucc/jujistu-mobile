import type { IconName } from '@jujistu/ui';

/**
 * Where a notification leads. The app maps targets to routes, so this feature
 * never imports navigation.
 */
export type NotificationTarget =
  | {
      readonly type: 'tournament';
      readonly tournamentId: string;
      readonly tab: 'Lịch thi đấu' | 'Kết quả' | 'Tổng sắp';
    }
  | { readonly type: 'missions' }
  | { readonly type: 'shop' };

export interface NotificationItem {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  /** Relative time such as `Vừa xong` or `2 giờ trước`. */
  readonly timeLabel: string;
  readonly target: NotificationTarget;
}
