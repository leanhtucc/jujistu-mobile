import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ATHLETE_DISCIPLINE_FILTERS,
  ATHLETES,
  FEATURED_ATHLETE_ID,
  FEATURED_TEASER,
} from '../data/athlete-content';
import { filterAthletes } from '../data/athlete-selectors';
import type {
  AthleteDisciplineFilter,
  AthleteSummary,
} from '../types/athlete.types';

export interface UseAthleteListResult {
  readonly query: string;
  readonly setQuery: (value: string) => void;
  readonly disciplines: readonly AthleteDisciplineFilter[];
  readonly activeDiscipline: AthleteDisciplineFilter;
  readonly selectDiscipline: (value: AthleteDisciplineFilter) => void;
  /** Spotlight athlete, shown only while no search or filter is active. */
  readonly spotlight: AthleteSummary | null;
  readonly spotlightTeaser: string;
  readonly listTitle: string;
  readonly countLabel: string;
  readonly athletes: readonly AthleteSummary[];
  readonly isEmpty: boolean;
  /** Transient message shown when an athlete has no journey yet. */
  readonly notice: string | null;
  /** Opens the journey, or raises a notice when none is published. */
  readonly openAthlete: (
    athlete: AthleteSummary,
    onOpen?: (athleteId: string) => void,
  ) => void;
}

const NOTICE_DURATION_MS = 2400;

export function useAthleteList(): UseAthleteListResult {
  const [query, setQuery] = useState('');
  const [activeDiscipline, setActiveDiscipline] =
    useState<AthleteDisciplineFilter>('Tất cả');

  const athletes = useMemo(
    () => filterAthletes(query, activeDiscipline),
    [query, activeDiscipline],
  );
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (noticeTimer.current) {
        clearTimeout(noticeTimer.current);
      }
    },
    [],
  );

  const openAthlete = useCallback(
    (athlete: AthleteSummary, onOpen?: (athleteId: string) => void) => {
      if (athlete.hasProfile) {
        onOpen?.(athlete.id);
        return;
      }
      if (noticeTimer.current) {
        clearTimeout(noticeTimer.current);
      }
      setNotice(`Hồ sơ ${athlete.name} đang được cập nhật`);
      noticeTimer.current = setTimeout(
        () => setNotice(null),
        NOTICE_DURATION_MS,
      );
    },
    [],
  );

  const showSpotlight = query.trim() === '' && activeDiscipline === 'Tất cả';

  return {
    query,
    setQuery,
    disciplines: ATHLETE_DISCIPLINE_FILTERS,
    activeDiscipline,
    selectDiscipline: setActiveDiscipline,
    spotlight: showSpotlight
      ? ATHLETES.find(athlete => athlete.id === FEATURED_ATHLETE_ID) ?? null
      : null,
    spotlightTeaser: FEATURED_TEASER,
    listTitle:
      activeDiscipline === 'Tất cả'
        ? 'TẤT CẢ VĐV · MÙA 2026'
        : activeDiscipline.toUpperCase(),
    countLabel: `${athletes.length} VĐV`,
    athletes,
    isEmpty: athletes.length === 0,
    notice,
    openAthlete,
  };
}
