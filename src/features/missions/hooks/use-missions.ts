import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  INITIAL_COINS,
  INITIAL_MISSION_PROGRESS,
  INITIAL_REFRESH_SECONDS,
  MISSION_TABS,
  MISSIONS_BY_TAB,
  STREAK_BASE_DONE,
  STREAK_CLAIM_REWARD,
  WEEK_BASE_DONE,
  WEEK_MISSION_TOTAL,
} from '../data/mission-content';
import {
  advanceMission,
  buildMissionRows,
  buildStreak,
  formatCoins,
  formatCountdown,
} from '../data/mission-selectors';
import type {
  MissionProgress,
  MissionRowModel,
  MissionTab,
  MissionToast,
  StreakDay,
} from '../types/mission.types';

/** Time the mission content takes to open before progress is recorded. */
const OPEN_CONTENT_MS = 1100;
const TOAST_MS = 2400;

export interface UseMissionsOptions {
  /**
   * Wallet balance owned by the app. When given, the hook shows it and reports
   * rewards through `onEarn` instead of keeping its own balance.
   */
  readonly coins?: number;
  readonly onEarn?: (amount: number) => void;
}

export interface UseMissionsResult {
  readonly coins: number;
  readonly coinsLabel: string;
  readonly tabs: typeof MISSION_TABS;
  readonly activeTab: MissionTab;
  readonly selectTab: (tab: MissionTab) => void;
  readonly missions: readonly MissionRowModel[];
  readonly onPressMission: (missionId: string) => void;
  readonly streak: readonly StreakDay[];
  readonly streakLabel: string;
  /** True once today's streak reward has been claimed. */
  readonly streakClaimed: boolean;
  readonly claimStreak: () => void;
  readonly weekDone: number;
  readonly weekTotal: number;
  readonly weekFraction: number;
  readonly refreshLabel: string;
  readonly toast: MissionToast | null;
  readonly shakingId: string | null;
}

export function useMissions({
  coins: controlledCoins,
  onEarn,
}: UseMissionsOptions = {}): UseMissionsResult {
  const [localCoins, setLocalCoins] = useState(INITIAL_COINS);
  const coins = controlledCoins ?? localCoins;
  const [activeTab, setActiveTab] = useState<MissionTab>('today');
  const [progress, setProgress] = useState<Record<string, MissionProgress>>(
    INITIAL_MISSION_PROGRESS,
  );
  const [streakClaimed, setStreakClaimed] = useState(false);
  const [refreshSeconds, setRefreshSeconds] = useState(INITIAL_REFRESH_SECONDS);
  const [toast, setToast] = useState<MissionToast | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);

  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastKey = useRef(0);

  useEffect(() => {
    const interval = setInterval(
      () => setRefreshSeconds(seconds => Math.max(0, seconds - 1)),
      1000,
    );
    const pending = timers.current;

    return () => {
      clearInterval(interval);
      pending.forEach(clearTimeout);
      pending.clear();
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
      if (shakeTimer.current) {
        clearTimeout(shakeTimer.current);
      }
    };
  }, []);

  const earn = useCallback(
    (amount: number) => {
      setLocalCoins(value => value + amount);
      onEarn?.(amount);
    },
    [onEarn],
  );

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastKey.current += 1;
    setToast({ message, key: toastKey.current });
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const later = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
  }, []);

  const allDefinitions = useMemo(
    () => [...MISSIONS_BY_TAB.today, ...MISSIONS_BY_TAB.week],
    [],
  );

  const onPressMission = useCallback(
    (missionId: string) => {
      const definition = allDefinitions.find(item => item.id === missionId);
      const current = progress[missionId];
      if (!definition || !current || current.busy) {
        return;
      }

      if (current.status === 'claimable') {
        setShakingId(missionId);
        if (shakeTimer.current) {
          clearTimeout(shakeTimer.current);
        }
        shakeTimer.current = setTimeout(() => setShakingId(null), 600);
        earn(definition.reward);
        setProgress(state => ({
          ...state,
          [missionId]: { ...current, status: 'claimed' },
        }));
        showToast(`Đã nhận ${formatCoins(definition.reward)} Xu`);
        return;
      }

      if (current.status === 'todo') {
        setProgress(state => ({
          ...state,
          [missionId]: { ...current, busy: true },
        }));
        later(() => {
          const next = advanceMission(definition, current);
          setProgress(state => ({ ...state, [missionId]: next }));
          showToast(
            next.status === 'claimable'
              ? 'Hoàn thành, bạn có thể nhận Xu'
              : `Tiến độ ${next.progress}/${definition.target}`,
          );
        }, OPEN_CONTENT_MS);
      }
    },
    [allDefinitions, earn, later, progress, showToast],
  );

  const claimStreak = useCallback(() => {
    if (streakClaimed) {
      return;
    }
    setStreakClaimed(true);
    earn(STREAK_CLAIM_REWARD);
    showToast(`Đã nhận ${formatCoins(STREAK_CLAIM_REWARD)} Xu`);
  }, [earn, showToast, streakClaimed]);

  const missions = useMemo(
    () => buildMissionRows(MISSIONS_BY_TAB[activeTab], progress),
    [activeTab, progress],
  );
  const streak = useMemo(() => buildStreak(streakClaimed), [streakClaimed]);

  const claimedCount = allDefinitions.filter(
    definition => progress[definition.id]?.status === 'claimed',
  ).length;
  const weekDone = Math.min(WEEK_MISSION_TOTAL, claimedCount + WEEK_BASE_DONE);

  return {
    coins,
    coinsLabel: formatCoins(coins),
    tabs: MISSION_TABS,
    activeTab,
    selectTab: setActiveTab,
    missions,
    onPressMission,
    streak,
    streakClaimed,
    streakLabel: `${STREAK_BASE_DONE + (streakClaimed ? 1 : 0)} / 7 ngày`,
    claimStreak,
    weekDone,
    weekTotal: WEEK_MISSION_TOTAL,
    weekFraction: weekDone / WEEK_MISSION_TOTAL,
    refreshLabel: formatCountdown(refreshSeconds),
    toast,
    shakingId,
  };
}
