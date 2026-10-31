import type {
  AthleteDisciplineFilter,
  AthleteProfile,
  AthleteSummary,
  CareerEvent,
  CareerFilter,
  CareerMatch,
  CareerMilestone,
  CareerYear,
  MatchResult,
} from '../types/athlete.types';

/**
 * Static content for the v4 prototype (Phase 1). Replaced by feature hooks and
 * services when the athlete API is available.
 */

export const FEATURED_ATHLETE_ID = 'tran-duc-anh';

export const ATHLETE_DISCIPLINE_FILTERS: readonly AthleteDisciplineFilter[] = [
  'Tất cả',
  'Newaza Gi',
  'Newaza NoGi',
  'Fighting',
  'Duo',
];

export const CAREER_FILTERS: readonly CareerFilter[] = [
  'Tất cả',
  'Huy chương',
  'Có video',
  'Cột mốc',
];

export const ATHLETES: readonly AthleteSummary[] = [
  {
    id: FEATURED_ATHLETE_ID,
    name: 'Trần Đức Anh',
    team: 'Đoàn Hà Nội',
    division: 'Newaza NoGi · Nam 69 kg',
    disciplines: ['Newaza Gi', 'Newaza NoGi'],
    goldMedals: 9,
    belt: 'brown',
    hasProfile: true,
  },
  {
    id: 'dang-minh-khoa',
    name: 'Đặng Minh Khoa',
    team: 'Đoàn TP.HCM',
    division: 'Newaza NoGi · Nam 69 kg',
    disciplines: ['Newaza NoGi'],
    goldMedals: 6,
    belt: 'brown',
    hasProfile: false,
  },
  {
    id: 'phan-thao-vy',
    name: 'Phan Thảo Vy',
    team: 'Đoàn Thái Nguyên',
    division: 'Newaza Gi · Nữ 45 kg',
    disciplines: ['Newaza Gi'],
    goldMedals: 7,
    belt: 'purple',
    hasProfile: false,
  },
  {
    id: 'le-quang-huy',
    name: 'Lê Quang Huy',
    team: 'Đoàn Thái Nguyên',
    division: 'Newaza NoGi · Nam 69 kg',
    disciplines: ['Newaza NoGi'],
    goldMedals: 3,
    belt: 'purple',
    hasProfile: false,
  },
  {
    id: 'ngo-hoang-nam',
    name: 'Ngô Hoàng Nam',
    team: 'Đoàn Hưng Yên',
    division: 'Fighting · Nam 62 kg',
    disciplines: ['Fighting'],
    goldMedals: 4,
    hasProfile: false,
  },
  {
    id: 'nguyen-thu-ha',
    name: 'Nguyễn Thu Hà',
    team: 'Đoàn Hà Nội',
    division: 'Newaza Gi · Nữ 45 kg',
    disciplines: ['Newaza Gi'],
    goldMedals: 2,
    belt: 'blue',
    hasProfile: false,
  },
  {
    id: 'ha-minh-tu-le-bao-ngoc',
    name: 'Hà Minh Tú · Lê Bảo Ngọc',
    team: 'Đoàn Thái Nguyên',
    division: 'Duo Show · Đôi nam nữ',
    disciplines: ['Duo'],
    goldMedals: 5,
    hasProfile: false,
  },
  {
    id: 'ly-hoang-phuc',
    name: 'Lý Hoàng Phúc',
    team: 'Đoàn TP.HCM',
    division: 'Fighting · Nam 62 kg',
    disciplines: ['Fighting'],
    goldMedals: 1,
    hasProfile: false,
  },
];

export const SPOTLIGHT_PHOTO = require('../../../../assets/image/avatars/athlete_spotlight.jpg');
const PROFILE_PHOTO = require('../../../../assets/image/avatars/athlete_tran_duc_anh.jpg');

type MatchTuple = readonly [
  round: string,
  result: 'T' | 'B' | '·',
  opponent: string,
  team: string,
  method: string,
  hasVideo: boolean,
];

const RESULT_BY_CODE: Record<MatchTuple[1], MatchResult> = {
  T: 'win',
  B: 'loss',
  '·': 'pending',
};

function matches(rows: readonly MatchTuple[]): readonly CareerMatch[] {
  return rows.map(([round, code, opponent, team, method, hasVideo]) => ({
    round,
    result: RESULT_BY_CODE[code],
    opponent,
    team,
    method,
    hasVideo,
  }));
}

function event(
  fields: Omit<CareerEvent, 'kind' | 'isLive' | 'isMedal'> &
    Partial<Pick<CareerEvent, 'isLive' | 'isMedal'>>,
): CareerEvent {
  return {
    kind: 'event',
    isLive: false,
    isMedal: ['HCV', 'HCB', 'HCĐ'].includes(fields.outcome),
    ...fields,
  };
}

function milestone(fields: Omit<CareerMilestone, 'kind'>): CareerMilestone {
  return { kind: 'milestone', ...fields };
}

/**
 * Career of the featured athlete. `finalPlayed` flips the national
 * championship's NoGi final from "pending at 20:00" to "won by armbar".
 */
function featuredCareer(finalPlayed: boolean): readonly CareerYear[] {
  return [
    {
      year: '2026',
      items: [
        event({
          id: 'nat26n',
          dateLabel: '28/09 · ĐÀ NẴNG',
          name: 'Giải vô địch Jujitsu Quốc gia 2026',
          division: 'Newaza NoGi · Nam 69 kg',
          outcome: finalPlayed ? 'HCV' : 'CK 20:00',
          outcomeVariant: finalPlayed ? 'accent' : 'solid',
          record: finalPlayed ? '4–0' : '3–0',
          hasVideo: true,
          isLive: !finalPlayed,
          matches: matches([
            finalPlayed
              ? [
                  'CHUNG KẾT',
                  'T',
                  'Đặng Minh Khoa',
                  'Đoàn TP.HCM',
                  'Submission · Armbar 04:05',
                  true,
                ]
              : [
                  'CHUNG KẾT',
                  '·',
                  'Đặng Minh Khoa',
                  'Đoàn TP.HCM',
                  '20:00 hôm nay · Thảm 1',
                  false,
                ],
            [
              'BÁN KẾT',
              'T',
              'Lê Quang Huy',
              'Đoàn Thái Nguyên',
              'Submission · Rear-naked choke 03:10',
              true,
            ],
            [
              'TỨ KẾT',
              'T',
              'Võ Thành Nam',
              'Đoàn Đồng Nai',
              'Điểm 6 – 2',
              true,
            ],
            [
              'VÒNG 1',
              'T',
              'Phạm Gia Bảo',
              'Đoàn TP.HCM',
              'Submission · Armbar 01:58',
              false,
            ],
          ]),
        }),
        event({
          id: 'nat26g',
          dateLabel: '26/09 · ĐÀ NẴNG',
          name: 'Giải vô địch Jujitsu Quốc gia 2026',
          division: 'Newaza Gi · Nam 69 kg',
          outcome: 'HCV',
          outcomeVariant: 'accent',
          record: '4–0',
          hasVideo: true,
          matches: matches([
            [
              'CHUNG KẾT',
              'T',
              'Lê Trọng Hiếu',
              'Đoàn TP.HCM',
              'Điểm 4 – 0',
              true,
            ],
            [
              'BÁN KẾT',
              'T',
              'Bùi Tuấn Kiệt',
              'Đoàn Thái Nguyên',
              'Submission · Triangle 02:47',
              false,
            ],
            [
              'TỨ KẾT',
              'T',
              'Ngô Quốc Trung',
              'Đoàn Hưng Yên',
              'Điểm 8 – 2',
              false,
            ],
            [
              'VÒNG 1',
              'T',
              'Hoàng Việt Long',
              'Đoàn Nghệ An',
              'Submission · Kimura 01:21',
              false,
            ],
          ]),
        }),
        milestone({
          id: 'm-belt',
          dateLabel: '05/2026',
          icon: 'medal',
          title: 'Lên đai nâu',
          description: 'Thăng đai tại CLB Sen Trắng sau 4 năm đai tím.',
        }),
        event({
          id: 'clb26',
          dateLabel: '08–12/04 · THÁI NGUYÊN',
          name: 'Giải vô địch các CLB Jujitsu Quốc gia 2026',
          division: 'Newaza Gi · Nam 69 kg',
          outcome: 'HCV',
          outcomeVariant: 'accent',
          record: '3–0',
          hasVideo: false,
          matches: matches([
            [
              'CHUNG KẾT',
              'T',
              'Bùi Tuấn Kiệt',
              'CLB Hồ Núi Cốc',
              'Điểm 2 – 0',
              false,
            ],
            [
              'BÁN KẾT',
              'T',
              'Trương Văn Lộc',
              'CLB Phố Hiến',
              'Submission · Armbar 03:33',
              false,
            ],
            [
              'TỨ KẾT',
              'T',
              'Tạ Minh Quân',
              'CLB Lam Hồng',
              'Điểm 7 – 0',
              false,
            ],
          ]),
        }),
      ],
    },
    {
      year: '2025',
      items: [
        event({
          id: 'intl25',
          dateLabel: '11/2025 · BANGKOK',
          name: 'Giải Jujitsu quốc tế mở rộng 2025',
          division: 'Newaza NoGi · Nam 69 kg',
          outcome: 'HCĐ',
          outcomeVariant: 'outline',
          record: '2–1',
          hasVideo: true,
          matches: matches([
            [
              'BÁN KẾT',
              'B',
              'VĐV Thái Lan',
              'Đội tuyển Thái Lan',
              'Điểm 0 – 2',
              true,
            ],
            [
              'TỨ KẾT',
              'T',
              'VĐV Philippines',
              'Đội tuyển Philippines',
              'Advantage 2 – 2',
              false,
            ],
            [
              'VÒNG 1',
              'T',
              'VĐV Malaysia',
              'Đội tuyển Malaysia',
              'Submission · Guillotine 02:05',
              false,
            ],
          ]),
        }),
        event({
          id: 'nat25',
          dateLabel: '15–23/09 · NGHỆ AN',
          name: 'Giải vô địch Jujitsu Quốc gia 2025',
          division: 'Newaza NoGi · Nam 69 kg',
          outcome: 'HCB',
          outcomeVariant: 'neutral',
          record: '3–1',
          hasVideo: true,
          matches: matches([
            [
              'CHUNG KẾT',
              'B',
              'Đặng Minh Khoa',
              'Đoàn TP.HCM',
              'Điểm 2 – 4',
              true,
            ],
            [
              'BÁN KẾT',
              'T',
              'Võ Thành Nam',
              'Đoàn Đồng Nai',
              'Submission · Kimura 04:40',
              false,
            ],
            [
              'TỨ KẾT',
              'T',
              'Lê Quang Huy',
              'Đoàn Thái Nguyên',
              'Điểm 3 – 0',
              false,
            ],
            [
              'VÒNG 1',
              'T',
              'Hoàng Việt Long',
              'Đoàn Nghệ An',
              'Điểm 6 – 0',
              false,
            ],
          ]),
        }),
        milestone({
          id: 'm-team',
          dateLabel: '01/2025',
          icon: 'usersThree',
          title: 'Lần đầu lên đội tuyển quốc gia',
          description: 'Được triệu tập tập trung đội tuyển Jujitsu tại Hà Nội.',
        }),
      ],
    },
    {
      year: '2024',
      items: [
        event({
          id: 'hn24',
          dateLabel: '10/2024 · HÀ NỘI',
          name: 'Cúp Jujitsu Hà Nội mở rộng 2024',
          division: 'Newaza NoGi · Nam 69 kg',
          outcome: 'HCV',
          outcomeVariant: 'accent',
          record: '3–0',
          hasVideo: false,
          matches: matches([
            [
              'CHUNG KẾT',
              'T',
              'Đặng Minh Khoa',
              'CLB Sài Gòn Grappling',
              'Submission · Rear-naked choke 05:12',
              false,
            ],
            [
              'BÁN KẾT',
              'T',
              'Ngô Quốc Trung',
              'CLB Phố Hiến',
              'Điểm 4 – 2',
              false,
            ],
            [
              'TỨ KẾT',
              'T',
              'Phạm Gia Bảo',
              'CLB Sài Gòn Grappling',
              'Điểm 2 – 0',
              false,
            ],
          ]),
        }),
        milestone({
          id: 'm-inj',
          dateLabel: '03/2024',
          icon: 'clock',
          title: 'Chấn thương dây chằng gối',
          description: 'Nghỉ thi đấu 7 tháng, trở lại thảm vào tháng 10/2024.',
        }),
      ],
    },
    {
      year: '2023',
      items: [
        event({
          id: 'nat23',
          dateLabel: '09/2023 · HẢI PHÒNG',
          name: 'Giải vô địch Jujitsu Quốc gia 2023',
          division: 'Newaza Gi · Nam 62 kg',
          outcome: 'HCĐ',
          outcomeVariant: 'outline',
          record: '2–1',
          hasVideo: false,
          matches: matches([
            [
              'BÁN KẾT',
              'B',
              'Đặng Minh Khoa',
              'Đoàn TP.HCM',
              'Submission · Bow and arrow 03:58',
              false,
            ],
            [
              'TỨ KẾT',
              'T',
              'Lý Hoàng Phúc',
              'Đoàn TP.HCM',
              'Điểm 2 – 0',
              false,
            ],
            [
              'VÒNG 1',
              'T',
              'Vũ Đức Mạnh',
              'Đoàn Ninh Bình',
              'Điểm 5 – 2',
              false,
            ],
          ]),
        }),
      ],
    },
    {
      year: '2021',
      items: [
        event({
          id: 'yth21',
          dateLabel: '06/2021 · BẮC NINH',
          name: 'Giải vô địch trẻ Jujitsu toàn quốc 2021',
          division: 'Newaza NoGi · U18 · 60 kg',
          outcome: 'HCV',
          outcomeVariant: 'accent',
          record: '4–0',
          hasVideo: false,
          matches: matches([
            [
              'CHUNG KẾT',
              'T',
              'Nguyễn Hữu Phát',
              'Đoàn Hà Nội',
              'Điểm 2 – 0',
              false,
            ],
            [
              'BÁN KẾT',
              'T',
              'Tạ Minh Quân',
              'Đoàn Nghệ An',
              'Submission · Armbar 02:20',
              false,
            ],
          ]),
        }),
      ],
    },
    {
      year: '2016',
      items: [
        milestone({
          id: 'm-start',
          dateLabel: '06/2016',
          icon: 'path',
          title: 'Bước lên thảm lần đầu',
          description:
            'Bắt đầu tập Jujitsu tại CLB Sen Trắng, Hà Nội, năm 13 tuổi.',
        }),
      ],
    },
  ];
}

export function buildFeaturedProfile(finalPlayed: boolean): AthleteProfile {
  return {
    athleteId: FEATURED_ATHLETE_ID,
    overline: 'NEWAZA GI · NOGI · NAM 69 KG',
    subtitle: 'Đoàn Hà Nội · CLB Sen Trắng · 23 tuổi',
    belt: 'brown',
    beltDegrees: 2,
    beltLabel: 'ĐAI NÂU · 2 VẠCH',
    yearsRange: '2016 – 2026',
    photo: PROFILE_PHOTO,
    stats: [
      { value: '10', label: 'năm thi đấu' },
      { value: finalPlayed ? '65' : '64', label: 'trận' },
      { value: finalPlayed ? '49' : '48', label: 'thắng' },
      { value: finalPlayed ? '22' : '21', label: 'submission' },
    ],
    medals: [
      { label: 'HCV', variant: 'accent', count: finalPlayed ? 10 : 9 },
      { label: 'HCB', variant: 'neutral', count: 5 },
      { label: 'HCĐ', variant: 'outline', count: 7 },
    ],
    career: featuredCareer(finalPlayed),
    rivals: [
      {
        name: 'Đặng Minh Khoa',
        team: 'Đoàn TP.HCM',
        record: finalPlayed ? '2 – 2' : '1 – 2',
        meetings: finalPlayed ? 4 : 3,
        trailing: !finalPlayed,
      },
      {
        name: 'Lê Quang Huy',
        team: 'Đoàn Thái Nguyên',
        record: '3 – 0',
        meetings: 3,
        trailing: false,
      },
      {
        name: 'Bùi Tuấn Kiệt',
        team: 'Đoàn Thái Nguyên',
        record: '2 – 1',
        meetings: 3,
        trailing: false,
      },
    ],
  };
}

export const FEATURED_TEASER = '10 năm · 64 trận · 9 HCV';
