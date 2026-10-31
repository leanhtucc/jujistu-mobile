import {
  MEDAL_STANDINGS,
  NATIONAL_DAYS,
  NATIONAL_TODAY_INDEX,
  NATIONAL_TODAY_SESSIONS,
  RESULT_NOGI_FINAL,
  RESULTS_BASE,
  TOURNAMENTS,
} from './tournament-content';
import type {
  DivisionResult,
  MedalTableRow,
  SessionStatus,
  Tournament,
  TournamentDay,
  TournamentLevelFilter,
  TournamentListEntry,
  TournamentSection,
  TournamentSession,
  TournamentSessionEntry,
  TournamentStatus,
} from '../types/tournament.types';

const MS_PER_DAY = 86_400_000;
/** A session is treated as finished 30 minutes after its start time. */
const SESSION_DURATION_MINUTES = 30;

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTournamentStatus(
  tournament: Tournament,
  today: Date,
): { readonly status: TournamentStatus; readonly daysUntilStart: number } {
  const start = parseIsoDate(tournament.startDate);
  const end = parseIsoDate(tournament.endDate);

  if (today < start) {
    return {
      status: 'upcoming',
      daysUntilStart: Math.round(
        (start.getTime() - today.getTime()) / MS_PER_DAY,
      ),
    };
  }

  return { status: today > end ? 'done' : 'live', daysUntilStart: 0 };
}

export function getStatusLabel(
  status: TournamentStatus,
  daysUntilStart: number,
): string {
  if (status === 'live') {
    return 'ĐANG DIỄN RA';
  }
  return status === 'upcoming' ? `CÒN ${daysUntilStart} NGÀY` : 'ĐÃ KẾT THÚC';
}

export function getMonthLabel(tournament: Tournament): string {
  return `TH${tournament.startDate.slice(5, 7)}`;
}

export function formatDateRange(tournament: Tournament): string {
  const month = tournament.startDate.slice(5, 7);
  const year = tournament.startDate.slice(0, 4);
  return `${tournament.dayRange}/${month}/${year}`;
}

const SECTION_ORDER: readonly {
  readonly status: TournamentStatus;
  readonly title: string;
}[] = [
  { status: 'live', title: 'ĐANG DIỄN RA' },
  { status: 'upcoming', title: 'SẮP DIỄN RA' },
  { status: 'done', title: 'ĐÃ KẾT THÚC' },
];

/**
 * Groups tournaments by status. Live and upcoming sort by nearest start,
 * finished tournaments by most recent start.
 */
export function buildTournamentSections(
  level: TournamentLevelFilter,
  today: Date,
): readonly TournamentSection[] {
  const entries: TournamentListEntry[] = TOURNAMENTS.filter(
    tournament => level === 'Tất cả' || tournament.level === level,
  ).map(tournament => {
    const { status, daysUntilStart } = getTournamentStatus(tournament, today);
    return {
      tournament,
      status,
      statusLabel: getStatusLabel(status, daysUntilStart),
      monthLabel: getMonthLabel(tournament),
      year: tournament.startDate.slice(0, 4),
    };
  });

  return SECTION_ORDER.flatMap(({ status, title }) => {
    const items = entries
      .filter(entry => entry.status === status)
      .sort((a, b) =>
        status === 'done'
          ? b.tournament.startDate.localeCompare(a.tournament.startDate)
          : a.tournament.startDate.localeCompare(b.tournament.startDate),
      );

    return items.length > 0
      ? [{ status, title, countLabel: `${items.length} giải`, items }]
      : [];
  });
}

export function findTournament(id: string): Tournament | undefined {
  return TOURNAMENTS.find(tournament => tournament.id === id);
}

export function getTournamentDays(): readonly TournamentDay[] {
  return NATIONAL_DAYS.map((day, index) => ({
    index,
    dateLabel: day.date,
    focus: day.focus,
  }));
}

function sessionsForDay(dayIndex: number): readonly TournamentSession[] {
  if (dayIndex === NATIONAL_TODAY_INDEX) {
    return NATIONAL_TODAY_SESSIONS;
  }

  const focus = NATIONAL_DAYS[dayIndex].focus
    .replace('Khai mạc · ', '')
    .replace(' · Bế mạc', '');
  const sessions: TournamentSession[] = [
    {
      time: '08:00',
      kind: 'VÒNG LOẠI',
      title: `${focus} · các hạng cân`,
      mats: 'THẢM 1–3',
    },
    { time: '14:00', kind: 'BÁN KẾT', title: focus, mats: 'THẢM 1–2' },
    { time: '19:00', kind: 'CHUNG KẾT', title: focus, mats: 'THẢM 1' },
  ];

  if (dayIndex === 0) {
    sessions.unshift({
      time: '07:30',
      kind: 'KHAI MẠC',
      title: 'Lễ khai mạc giải',
      mats: 'SÂN CHÍNH',
    });
  }
  if (dayIndex === NATIONAL_DAYS.length - 1) {
    sessions.push({
      time: '20:30',
      kind: 'BẾ MẠC',
      title: 'Lễ bế mạc và trao cờ đăng cai',
      mats: 'SÂN CHÍNH',
    });
  }

  return sessions;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export interface SessionClock {
  /** Index of today within the tournament days, or `null` once it is over. */
  readonly todayIndex: number | null;
  readonly nowMinutes: number;
}

function resolveSessionStatus(
  session: TournamentSession,
  dayIndex: number,
  clock: SessionClock,
): { readonly status: SessionStatus; readonly label: string } {
  const { todayIndex, nowMinutes } = clock;

  if (todayIndex === null || dayIndex < todayIndex) {
    return { status: 'done', label: 'ĐÃ XONG' };
  }
  if (dayIndex > todayIndex) {
    return { status: 'later', label: 'SẮP DIỄN RA' };
  }

  const start = toMinutes(session.time);
  if (start + SESSION_DURATION_MINUTES <= nowMinutes) {
    return { status: 'done', label: 'ĐÃ XONG' };
  }
  if (start <= nowMinutes) {
    return { status: 'now', label: 'ĐANG DIỄN RA' };
  }
  return { status: 'soon', label: `CÒN ${start - nowMinutes} PHÚT` };
}

export function buildSessionEntries(
  dayIndex: number,
  clock: SessionClock,
): readonly TournamentSessionEntry[] {
  return sessionsForDay(dayIndex).map(session => {
    const { status, label } = resolveSessionStatus(session, dayIndex, clock);
    return { session, status, statusLabel: label };
  });
}

export function buildResults(
  status: TournamentStatus,
): readonly DivisionResult[] {
  return status === 'done'
    ? [RESULT_NOGI_FINAL, ...RESULTS_BASE]
    : RESULTS_BASE;
}

export function buildMedalTable(): readonly MedalTableRow[] {
  return MEDAL_STANDINGS.map(([team, gold, silver, bronze], index) => ({
    rank: index + 1,
    team,
    gold,
    silver,
    bronze,
    total: gold + silver + bronze,
  }));
}
