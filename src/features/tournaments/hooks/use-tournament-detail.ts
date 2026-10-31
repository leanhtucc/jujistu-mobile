import { useCallback, useMemo, useState } from 'react';

import {
  NATIONAL_TODAY_INDEX,
  TOURNAMENT_MOCK_NOW_MINUTES,
  TOURNAMENT_MOCK_TODAY,
} from '../data/tournament-content';
import {
  buildMedalTable,
  buildResults,
  buildSessionEntries,
  findTournament,
  formatDateRange,
  getStatusLabel,
  getTournamentDays,
  getTournamentStatus,
  parseIsoDate,
} from '../data/tournament-selectors';
import type {
  DivisionResult,
  MedalTableRow,
  Tournament,
  TournamentDay,
  TournamentDetailTab,
  TournamentSessionEntry,
  TournamentStatus,
} from '../types/tournament.types';

export const TOURNAMENT_DETAIL_TABS: readonly TournamentDetailTab[] = [
  'Lịch thi đấu',
  'Kết quả',
  'Tổng sắp',
];

export type TournamentCtaKind = 'watch' | 'remind' | 'replay';

export interface TournamentCta {
  readonly kind: TournamentCtaKind;
  readonly label: string;
}

export interface TournamentInfoRow {
  readonly label: string;
  readonly value: string;
}

export interface UseTournamentDetailOptions {
  readonly tournamentId: string;
  readonly initialTab?: string;
  /** ISO date treated as "today". Defaults to the prototype reference day. */
  readonly today?: string;
  readonly nowMinutes?: number;
}

export interface UseTournamentDetailResult {
  readonly tournament: Tournament | null;
  readonly status: TournamentStatus;
  readonly statusLabel: string;
  readonly dateRange: string;
  readonly tabs: readonly TournamentDetailTab[];
  readonly activeTab: TournamentDetailTab;
  readonly selectTab: (tab: TournamentDetailTab) => void;
  readonly days: readonly TournamentDay[];
  readonly activeDay: TournamentDay;
  /** Index of today within `days`, or `null` when the tournament is over. */
  readonly todayIndex: number | null;
  readonly selectDay: (index: number) => void;
  readonly sessions: readonly TournamentSessionEntry[];
  readonly results: readonly DivisionResult[];
  readonly medalTable: readonly MedalTableRow[];
  readonly infoRows: readonly TournamentInfoRow[];
  readonly briefNote: string;
  readonly cta: TournamentCta;
  readonly reminded: boolean;
  readonly toggleReminder: () => void;
}

function resolveInitialTab(
  initialTab: string | undefined,
): TournamentDetailTab {
  return (
    TOURNAMENT_DETAIL_TABS.find(tab => tab === initialTab) ?? 'Lịch thi đấu'
  );
}

function resolveCta(
  status: TournamentStatus,
  reminded: boolean,
): TournamentCta {
  if (status === 'live') {
    return { kind: 'watch', label: 'Xem trực tiếp trên YouTube' };
  }
  if (status === 'upcoming') {
    return {
      kind: 'remind',
      label: reminded ? 'Đã bật nhắc lịch giải' : 'Nhắc tôi khi có lịch',
    };
  }
  return { kind: 'replay', label: 'Xem video phát lại' };
}

export function useTournamentDetail({
  tournamentId,
  initialTab,
  today = TOURNAMENT_MOCK_TODAY,
  nowMinutes = TOURNAMENT_MOCK_NOW_MINUTES,
}: UseTournamentDetailOptions): UseTournamentDetailResult {
  const tournament = useMemo(
    () => findTournament(tournamentId) ?? null,
    [tournamentId],
  );
  const days = useMemo(() => getTournamentDays(), []);

  const resolved = useMemo(
    () =>
      tournament
        ? getTournamentStatus(tournament, parseIsoDate(today))
        : { status: 'done' as const, daysUntilStart: 0 },
    [tournament, today],
  );
  const status = resolved.status;
  const todayIndex = status === 'live' ? NATIONAL_TODAY_INDEX : null;

  const [activeTab, setActiveTab] = useState<TournamentDetailTab>(() =>
    resolveInitialTab(initialTab),
  );
  const [dayIndex, setDayIndex] = useState<number>(
    todayIndex ?? days.length - 1,
  );
  const [reminded, setReminded] = useState(false);
  const toggleReminder = useCallback(() => setReminded(value => !value), []);

  const sessions = useMemo(
    () => buildSessionEntries(dayIndex, { todayIndex, nowMinutes }),
    [dayIndex, todayIndex, nowMinutes],
  );
  const results = useMemo(() => buildResults(status), [status]);
  const medalTable = useMemo(() => buildMedalTable(), []);

  const infoRows = useMemo<readonly TournamentInfoRow[]>(
    () =>
      tournament
        ? [
            { label: 'Cấp giải', value: tournament.level },
            { label: 'Thời gian', value: formatDateRange(tournament) },
            { label: 'Địa điểm', value: tournament.place },
            { label: 'Nội dung', value: tournament.disciplines.join(', ') },
            { label: 'Đơn vị tổ chức', value: tournament.organizer },
          ]
        : [],
    [tournament],
  );

  return {
    tournament,
    status,
    statusLabel: getStatusLabel(status, resolved.daysUntilStart),
    dateRange: tournament ? formatDateRange(tournament) : '',
    tabs: TOURNAMENT_DETAIL_TABS,
    activeTab,
    selectTab: setActiveTab,
    days,
    activeDay: days[dayIndex],
    todayIndex,
    selectDay: setDayIndex,
    sessions,
    results,
    medalTable,
    infoRows,
    briefNote:
      status === 'upcoming'
        ? 'Lịch thi đấu chi tiết và danh sách VĐV sẽ được cập nhật trước ngày khai mạc.'
        : 'Kết quả chi tiết của giải đang được cập nhật lên hệ thống.',
    cta: resolveCta(status, reminded),
    reminded,
    toggleReminder,
  };
}
