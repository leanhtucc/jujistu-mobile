/**
 * Tournaments feature, list hook.
 * Flow: TournamentListScreen -> useTournamentList (this file) -> TournamentListItem.
 * Sections (ongoing / upcoming / finished) are derived from `today`, which defaults
 * to a fixed reference day while data is static (ADR-0019 mock seam).
 */
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

/** Level filter plus the tournament sections computed for `today` (injectable for tests). */
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
