import { useCallback, useMemo, useState } from 'react';

import { CAREER_FILTERS } from '../data/athlete-content';
import {
  filterCareer,
  findAthlete,
  findAthleteProfile,
} from '../data/athlete-selectors';
import type {
  AthleteProfile,
  AthleteSummary,
  CareerFilter,
  CareerYear,
} from '../types/athlete.types';

export interface UseAthleteProfileOptions {
  readonly athleteId: string;
  /** Whether the national championship's NoGi final has been played. */
  readonly finalPlayed?: boolean;
}

export interface UseAthleteProfileResult {
  readonly athlete: AthleteSummary | null;
  /** Null while the athlete exists but has no published journey. */
  readonly profile: AthleteProfile | null;
  readonly filters: readonly CareerFilter[];
  readonly activeFilter: CareerFilter;
  readonly selectFilter: (filter: CareerFilter) => void;
  readonly career: readonly CareerYear[];
  readonly isExpanded: (eventId: string) => boolean;
  readonly toggleEvent: (eventId: string) => void;
  readonly following: boolean;
  readonly toggleFollow: () => void;
}

/** Event expanded when the journey opens: the live national championship. */
const INITIALLY_EXPANDED = 'nat26n';

export function useAthleteProfile({
  athleteId,
  finalPlayed = false,
}: UseAthleteProfileOptions): UseAthleteProfileResult {
  const athlete = useMemo(() => findAthlete(athleteId) ?? null, [athleteId]);
  const profile = useMemo(
    () => findAthleteProfile(athleteId, finalPlayed) ?? null,
    [athleteId, finalPlayed],
  );

  const [activeFilter, setActiveFilter] = useState<CareerFilter>('Tất cả');
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () => new Set([INITIALLY_EXPANDED]),
  );
  const [following, setFollowing] = useState(false);

  const toggleEvent = useCallback((eventId: string) => {
    setExpanded(current => {
      const next = new Set(current);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  }, []);
  const isExpanded = useCallback(
    (eventId: string) => expanded.has(eventId),
    [expanded],
  );
  const toggleFollow = useCallback(() => setFollowing(value => !value), []);

  const career = useMemo(
    () => (profile ? filterCareer(profile.career, activeFilter) : []),
    [profile, activeFilter],
  );

  return {
    athlete,
    profile,
    filters: CAREER_FILTERS,
    activeFilter,
    selectFilter: setActiveFilter,
    career,
    isExpanded,
    toggleEvent,
    following,
    toggleFollow,
  };
}
