import { STREAK_BASE_DONE, STREAK_REWARDS } from './mission-content';
import type {
  MissionDefinition,
  MissionProgress,
  MissionRowModel,
  StreakDay,
} from '../types/mission.types';

/** Vietnamese thousands grouping (`12.500`) without relying on `Intl`. */
export function formatCoins(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** `HH:MM:SS` countdown label. */
export function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map(part => String(part).padStart(2, '0'))
    .join(':');
}

export function buildMissionRows(
  definitions: readonly MissionDefinition[],
  progress: Readonly<Record<string, MissionProgress>>,
): readonly MissionRowModel[] {
  return definitions.map(definition => {
    const state = progress[definition.id] ?? {
      progress: 0,
      status: 'todo' as const,
      busy: false,
    };
    const showProgress = definition.target > 1;

    return {
      ...definition,
      progress: state.progress,
      status: state.status,
      busy: state.busy,
      showProgress,
      fraction: definition.target > 0 ? state.progress / definition.target : 0,
      progressLabel: `${state.progress}/${definition.target}`,
    };
  });
}

/** Progress of a mission after one more step has been completed. */
export function advanceMission(
  definition: MissionDefinition,
  current: MissionProgress,
): MissionProgress {
  const target = definition.target || 1;
  const progress = Math.min(target, current.progress + 1);

  return {
    progress,
    status: progress >= target ? 'claimable' : 'todo',
    busy: false,
  };
}

export function buildStreak(claimedToday: boolean): readonly StreakDay[] {
  const done = STREAK_BASE_DONE + (claimedToday ? 1 : 0);

  return STREAK_REWARDS.map((reward, index) => ({
    index,
    reward,
    isFinal: index === STREAK_REWARDS.length - 1,
    state:
      index < done
        ? ('done' as const)
        : index === STREAK_BASE_DONE
        ? ('today' as const)
        : ('locked' as const),
  }));
}
