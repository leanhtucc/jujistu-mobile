import { useMemo, useState } from 'react';

import {
  TOURNAMENT_LEVEL_FILTERS,
  TOURNAMENT_MOCK_TODAY,
} from '../data/tournament-content';
import {
  buildTournamentSections,
  parseIsoDate,
} from '../data/tournament-selectors';
import type {
  TournamentLevelFilter,
  TournamentSection,
} from '../types/tournament.types';

export interface UseTournamentListOptions {
  /** ISO date treated as "today". Defaults to the prototype reference day. */
  readonly today?: string;
}

export interface UseTournamentListResult {
  readonly levels: readonly TournamentLevelFilter[];
  readonly activeLevel: TournamentLevelFilter;
  readonly selectLevel: (level: TournamentLevelFilter) => void;
  readonly sections: readonly TournamentSection[];
}

export function useTournamentList({
  today = TOURNAMENT_MOCK_TODAY,
}: UseTournamentListOptions = {}): UseTournamentListResult {
  const [activeLevel, setActiveLevel] =
    useState<TournamentLevelFilter>('Tất cả');

  const sections = useMemo(
    () => buildTournamentSections(activeLevel, parseIsoDate(today)),
    [activeLevel, today],
  );

  return {
    levels: TOURNAMENT_LEVEL_FILTERS,
    activeLevel,
    selectLevel: setActiveLevel,
    sections,
  };
}
