import type {
  DivisionResult,
  Tournament,
  TournamentLevelFilter,
  TournamentSession,
} from '../types/tournament.types';

/**
 * Static content for the v4 prototype (Phase 1). It stands in for the content
 * service and is replaced by feature hooks/services when the API is available.
 */

/** Reference "today" of the prototype: the national championship's day 5. */
export const TOURNAMENT_MOCK_TODAY = '2026-09-28';

/** Reference clock of the prototype on that day, in minutes after midnight. */
export const TOURNAMENT_MOCK_NOW_MINUTES = 19 * 60 + 32;

/** Index of {@link TOURNAMENT_MOCK_TODAY} within {@link NATIONAL_DAYS}. */
export const NATIONAL_TODAY_INDEX = 4;

export const FEATURED_ATHLETE_ID = 'Trần Đức Anh';

export const TOURNAMENT_LEVEL_FILTERS: readonly TournamentLevelFilter[] = [
  'Tất cả',
  'Quốc gia',
  'Quốc tế',
  'Mở rộng',
  'CLB',
  'Trẻ',
];

export const TOURNAMENTS: readonly Tournament[] = [
  {
    id: 'nat26',
    level: 'Quốc gia',
    name: 'Giải vô địch Jujitsu Quốc gia 2026',
    shortName: 'Vô địch Quốc gia 2026',
    place: 'Cung thể thao Tiên Sơn · Đà Nẵng',
    startDate: '2026-09-24',
    endDate: '2026-09-30',
    dayRange: '24–30',
    disciplines: ['Newaza Gi', 'Newaza NoGi', 'Fighting', 'Contact', 'Duo'],
    organizer: 'Liên đoàn Jujitsu Việt Nam',
    stats: [
      { value: '17', label: 'đoàn' },
      { value: '312', label: 'VĐV' },
      { value: '96', label: 'bộ huy chương' },
    ],
    hasFullDetail: true,
  },
  {
    id: 'asiad',
    level: 'Quốc tế',
    name: 'Jujitsu tại ASIAD 2026',
    shortName: 'ASIAD 2026',
    place: 'Aichi Budokan · Nagoya, Nhật Bản',
    startDate: '2026-10-01',
    endDate: '2026-10-03',
    dayRange: '01–03',
    disciplines: ['Newaza'],
    organizer: 'Hội đồng Olympic châu Á',
    hasFullDetail: false,
  },
  {
    id: 'hn',
    level: 'Mở rộng',
    name: 'Cúp Jujitsu Hà Nội mở rộng 2026',
    shortName: 'Cúp Hà Nội 2026',
    place: 'Nhà thi đấu Trịnh Hoài Đức · Hà Nội',
    startDate: '2026-10-24',
    endDate: '2026-10-26',
    dayRange: '24–26',
    disciplines: ['Newaza Gi', 'Newaza NoGi', 'Duo'],
    organizer: 'Liên đoàn Jujitsu Hà Nội',
    hasFullDetail: false,
  },
  {
    id: 'hcm',
    level: 'CLB',
    name: 'Giải Jujitsu các CLB TP.HCM 2026',
    shortName: 'CLB TP.HCM 2026',
    place: 'Nhà thi đấu Phú Thọ · TP.HCM',
    startDate: '2026-11-14',
    endDate: '2026-11-16',
    dayRange: '14–16',
    disciplines: ['Newaza NoGi', 'Fighting'],
    organizer: 'Liên đoàn Jujitsu TP.HCM',
    hasFullDetail: false,
  },
  {
    id: 'dn',
    level: 'Mở rộng',
    name: 'Cúp Jujitsu Đà Nẵng mở rộng 2026',
    shortName: 'Cúp Đà Nẵng 2026',
    place: 'Cung thể thao Tiên Sơn · Đà Nẵng',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    dayRange: '05–06',
    disciplines: ['Newaza Gi', 'Newaza NoGi'],
    organizer: 'Liên đoàn Jujitsu Đà Nẵng',
    hasFullDetail: false,
  },
  {
    id: 'yth',
    level: 'Trẻ',
    name: 'Giải vô địch trẻ Jujitsu toàn quốc 2026',
    shortName: 'Vô địch trẻ 2026',
    place: 'Trường ĐH TDTT Bắc Ninh',
    startDate: '2026-05-10',
    endDate: '2026-05-20',
    dayRange: '10–20',
    disciplines: ['Newaza Gi', 'Newaza NoGi', 'Fighting', 'Duo', 'Show'],
    organizer: 'Liên đoàn Jujitsu Việt Nam',
    hasFullDetail: false,
  },
  {
    id: 'clb',
    level: 'CLB',
    name: 'Giải vô địch các CLB Jujitsu Quốc gia 2026',
    shortName: 'Vô địch CLB 2026',
    place: 'Hồ Núi Cốc · Thái Nguyên',
    startDate: '2026-04-08',
    endDate: '2026-04-12',
    dayRange: '08–12',
    disciplines: ['Newaza Gi', 'Newaza NoGi', 'Contact'],
    organizer: 'Liên đoàn Jujitsu Việt Nam',
    hasFullDetail: false,
  },
];

export const NATIONAL_DAYS: readonly { date: string; focus: string }[] = [
  { date: '24/09', focus: 'Khai mạc · Duo Show' },
  { date: '25/09', focus: 'Newaza Gi · Nữ' },
  { date: '26/09', focus: 'Newaza Gi · Nam' },
  { date: '27/09', focus: 'Fighting' },
  { date: '28/09', focus: 'Newaza NoGi' },
  { date: '29/09', focus: 'Contact' },
  { date: '30/09', focus: 'Duo Classic · Bế mạc' },
];

/** Detailed sessions of the national championship's day 5. */
export const NATIONAL_TODAY_SESSIONS: readonly TournamentSession[] = [
  {
    time: '08:00',
    kind: 'VÒNG LOẠI',
    title: 'Newaza NoGi · Nam 62–77 kg',
    mats: 'THẢM 1–3',
  },
  {
    time: '10:30',
    kind: 'VÒNG LOẠI',
    title: 'Newaza NoGi · Nữ 48–57 kg',
    mats: 'THẢM 1–3',
  },
  {
    time: '14:00',
    kind: 'BÁN KẾT',
    title: 'Newaza NoGi · Nam 62–77 kg',
    mats: 'THẢM 1–2',
  },
  {
    time: '16:00',
    kind: 'BÁN KẾT',
    title: 'Newaza NoGi · Nữ 48–57 kg',
    mats: 'THẢM 1–2',
  },
  {
    time: '19:30',
    kind: 'CHUNG KẾT',
    title: 'Newaza NoGi · Nữ 48–57 kg',
    mats: 'THẢM 1',
  },
  {
    time: '20:00',
    kind: 'CHUNG KẾT',
    title: 'Newaza NoGi · Nam 69 kg',
    mats: 'THẢM 1',
    isFaceOff: true,
  },
];

export const FACE_OFF_ATHLETES = {
  home: 'Trần Đức Anh',
  away: 'Đặng Minh Khoa',
} as const;

export const FACE_OFF_DONE_SUMMARY = 'HCV: Trần Đức Anh · Sub Armbar 04:05';

export const RESULTS_BASE: readonly DivisionResult[] = [
  {
    division: 'NEWAZA GI · NAM 69 KG',
    finalSummary: 'Chung kết: Điểm 4 – 0',
    medals: [
      {
        medal: 'HCV',
        name: 'Trần Đức Anh',
        team: 'Đoàn Hà Nội',
        athleteId: FEATURED_ATHLETE_ID,
      },
      { medal: 'HCB', name: 'Lê Trọng Hiếu', team: 'Đoàn TP.HCM' },
      { medal: 'HCĐ', name: 'Bùi Tuấn Kiệt', team: 'Đoàn Thái Nguyên' },
      { medal: 'HCĐ', name: 'Ngô Quốc Trung', team: 'Đoàn Hưng Yên' },
    ],
  },
  {
    division: 'NEWAZA GI · NỮ 45 KG',
    finalSummary: 'Chung kết: Submission · Armbar 02:12',
    medals: [
      { medal: 'HCV', name: 'Phan Thảo Vy', team: 'Đoàn Thái Nguyên' },
      { medal: 'HCB', name: 'Nguyễn Thu Hà', team: 'Đoàn Hà Nội' },
      { medal: 'HCĐ', name: 'Trịnh Mai Linh', team: 'Đoàn Thanh Hóa' },
      { medal: 'HCĐ', name: 'Đỗ Ngọc Ánh', team: 'Đoàn Đồng Nai' },
    ],
  },
  {
    division: 'FIGHTING · NAM 62 KG',
    finalSummary: 'Chung kết: Điểm 14 – 9',
    medals: [
      { medal: 'HCV', name: 'Ngô Hoàng Nam', team: 'Đoàn Hưng Yên' },
      { medal: 'HCB', name: 'Lý Hoàng Phúc', team: 'Đoàn TP.HCM' },
      { medal: 'HCĐ', name: 'Vũ Đức Mạnh', team: 'Đoàn Ninh Bình' },
      { medal: 'HCĐ', name: 'Tạ Minh Quân', team: 'Đoàn Nghệ An' },
    ],
  },
  {
    division: 'DUO SHOW · ĐÔI NAM NỮ',
    finalSummary: 'Điểm trình diễn 48,5',
    medals: [
      {
        medal: 'HCV',
        name: 'Hà Minh Tú · Lê Bảo Ngọc',
        team: 'Đoàn Thái Nguyên',
      },
      {
        medal: 'HCB',
        name: 'Phạm Quốc Việt · Mai Thu Trang',
        team: 'Đoàn Hà Nội',
      },
      {
        medal: 'HCĐ',
        name: 'Đinh Công Sơn · Vũ Hải Yến',
        team: 'Đoàn Thanh Hóa',
      },
    ],
  },
];

/** Added once the NoGi final of day 5 has been played. */
export const RESULT_NOGI_FINAL: DivisionResult = {
  division: 'NEWAZA NOGI · NAM 69 KG',
  finalSummary: 'Chung kết: Submission · Armbar 04:05',
  medals: [
    {
      medal: 'HCV',
      name: 'Trần Đức Anh',
      team: 'Đoàn Hà Nội',
      athleteId: FEATURED_ATHLETE_ID,
    },
    { medal: 'HCB', name: 'Đặng Minh Khoa', team: 'Đoàn TP.HCM' },
    { medal: 'HCĐ', name: 'Lê Quang Huy', team: 'Đoàn Thái Nguyên' },
    { medal: 'HCĐ', name: 'Trương Văn Lộc', team: 'Đoàn Hưng Yên' },
  ],
};

/** `[team, gold, silver, bronze]`, already ranked. */
export const MEDAL_STANDINGS: readonly (readonly [
  string,
  number,
  number,
  number,
])[] = [
  ['Thái Nguyên', 11, 8, 7],
  ['TP.HCM', 7, 10, 15],
  ['Hà Nội', 6, 4, 5],
  ['Hưng Yên', 5, 4, 8],
  ['Đồng Nai', 3, 5, 6],
  ['Thanh Hóa', 3, 3, 7],
  ['Ninh Bình', 2, 3, 4],
  ['Nghệ An', 1, 2, 6],
];
