import type { ImageSourcePropType } from 'react-native';
import type { IconName } from '@jujistu/ui';

export type AthleteBelt = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export type AthleteDisciplineFilter =
  | 'Tất cả'
  | 'Newaza Gi'
  | 'Newaza NoGi'
  | 'Fighting'
  | 'Duo';

export interface AthleteSummary {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly division: string;
  readonly disciplines: readonly AthleteDisciplineFilter[];
  readonly goldMedals: number;
  readonly belt?: AthleteBelt;
  /** Only athletes with a profile open the journey screen. */
  readonly hasProfile: boolean;
}

export type MedalLabel = 'HCV' | 'HCB' | 'HCĐ';

export type CareerMedalVariant = 'accent' | 'neutral' | 'outline' | 'solid';

export type MatchResult = 'win' | 'loss' | 'pending';

export interface CareerMatch {
  readonly round: string;
  readonly result: MatchResult;
  readonly opponent: string;
  readonly team: string;
  readonly method: string;
  readonly hasVideo: boolean;
}

export interface CareerEvent {
  readonly kind: 'event';
  readonly id: string;
  readonly dateLabel: string;
  readonly name: string;
  readonly division: string;
  /** Medal label, or a status such as `CK 20:00` while the final is pending. */
  readonly outcome: string;
  readonly outcomeVariant: CareerMedalVariant;
  readonly isMedal: boolean;
  readonly record: string;
  readonly hasVideo: boolean;
  readonly isLive: boolean;
  readonly matches: readonly CareerMatch[];
}

export interface CareerMilestone {
  readonly kind: 'milestone';
  readonly id: string;
  readonly dateLabel: string;
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
}

export type CareerItem = CareerEvent | CareerMilestone;

export interface CareerYear {
  readonly year: string;
  readonly items: readonly CareerItem[];
}

export interface AthleteStat {
  readonly value: string;
  readonly label: string;
}

export interface AthleteMedalCount {
  readonly label: MedalLabel;
  readonly variant: CareerMedalVariant;
  readonly count: number;
}

export interface AthleteRival {
  readonly name: string;
  readonly team: string;
  readonly record: string;
  readonly meetings: number;
  /** True when the athlete is behind in the head-to-head. */
  readonly trailing: boolean;
}

export interface AthleteProfile {
  readonly athleteId: string;
  readonly overline: string;
  readonly subtitle: string;
  readonly belt: AthleteBelt;
  readonly beltDegrees: number;
  readonly beltLabel: string;
  readonly yearsRange: string;
  readonly photo: ImageSourcePropType;
  readonly stats: readonly AthleteStat[];
  readonly medals: readonly AthleteMedalCount[];
  readonly career: readonly CareerYear[];
  readonly rivals: readonly AthleteRival[];
}

export type CareerFilter = 'Tất cả' | 'Huy chương' | 'Có video' | 'Cột mốc';
