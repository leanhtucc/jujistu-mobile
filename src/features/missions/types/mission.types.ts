import type { IconName } from '@jujistu/ui';

export type MissionTab = 'today' | 'week';

/**
 * `pending` missions are recorded by the system and have no action button.
 */
export type MissionStatus = 'todo' | 'claimable' | 'claimed' | 'pending';

export interface MissionDefinition {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  /** Coins granted when the reward is claimed. */
  readonly reward: number;
  /** Steps required to complete; `0` means the system records it. */
  readonly target: number;
}

export interface MissionProgress {
  readonly progress: number;
  readonly status: MissionStatus;
  /** True while the mission's content is being opened. */
  readonly busy: boolean;
}

export interface MissionRowModel extends MissionDefinition {
  readonly progress: number;
  readonly status: MissionStatus;
  readonly busy: boolean;
  /** Progress is only shown for multi-step missions. */
  readonly showProgress: boolean;
  readonly fraction: number;
  readonly progressLabel: string;
}

export type StreakDayState = 'done' | 'today' | 'locked';

export interface StreakDay {
  readonly index: number;
  readonly reward: number;
  readonly state: StreakDayState;
  readonly isFinal: boolean;
}

export interface MissionToast {
  readonly message: string;
  /** Changes on every toast so identical messages still re-trigger. */
  readonly key: number;
}
