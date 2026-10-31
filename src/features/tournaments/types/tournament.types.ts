export type TournamentLevel =
  | 'Quốc gia'
  | 'Quốc tế'
  | 'Mở rộng'
  | 'CLB'
  | 'Trẻ';

export type TournamentLevelFilter = 'Tất cả' | TournamentLevel;

export type TournamentStatus = 'live' | 'upcoming' | 'done';

/** Tabs rendered on the detail screen. The bracket tab is out of Phase 1 scope. */
export type TournamentDetailTab = 'Lịch thi đấu' | 'Kết quả' | 'Tổng sắp';

export interface TournamentStat {
  readonly value: string;
  readonly label: string;
}

export interface Tournament {
  readonly id: string;
  readonly level: TournamentLevel;
  readonly name: string;
  readonly shortName: string;
  readonly place: string;
  /** ISO calendar date, `YYYY-MM-DD`. */
  readonly startDate: string;
  readonly endDate: string;
  /** Display range of days, e.g. `24–30`. */
  readonly dayRange: string;
  readonly disciplines: readonly string[];
  readonly organizer: string;
  readonly stats?: readonly TournamentStat[];
  /** Full tournaments have a schedule, results and medal table. */
  readonly hasFullDetail: boolean;
}

export interface TournamentSection {
  readonly status: TournamentStatus;
  readonly title: string;
  readonly countLabel: string;
  readonly items: readonly TournamentListEntry[];
}

export interface TournamentListEntry {
  readonly tournament: Tournament;
  readonly status: TournamentStatus;
  readonly statusLabel: string;
  readonly monthLabel: string;
  readonly year: string;
}

export type TournamentSessionKind =
  | 'VÒNG LOẠI'
  | 'BÁN KẾT'
  | 'CHUNG KẾT'
  | 'KHAI MẠC'
  | 'BẾ MẠC';

export interface TournamentSession {
  readonly time: string;
  readonly kind: TournamentSessionKind;
  readonly title: string;
  readonly mats: string;
  /** Marks the headline face-off of the day. */
  readonly isFaceOff?: boolean;
}

export type SessionStatus = 'done' | 'now' | 'soon' | 'later';

export interface TournamentSessionEntry {
  readonly session: TournamentSession;
  readonly status: SessionStatus;
  readonly statusLabel: string;
}

export type MedalKind = 'HCV' | 'HCB' | 'HCĐ';

export interface MedalWinner {
  readonly medal: MedalKind;
  readonly name: string;
  readonly team: string;
  /** Present when the athlete has a profile screen. */
  readonly athleteId?: string;
}

export interface DivisionResult {
  readonly division: string;
  readonly finalSummary: string;
  readonly medals: readonly MedalWinner[];
}

export interface MedalTableRow {
  readonly rank: number;
  readonly team: string;
  readonly gold: number;
  readonly silver: number;
  readonly bronze: number;
  readonly total: number;
}

export interface TournamentDay {
  readonly index: number;
  readonly dateLabel: string;
  readonly focus: string;
}
