import { ATHLETES, buildFeaturedProfile } from './athlete-content';
import type {
  AthleteDisciplineFilter,
  AthleteProfile,
  AthleteSummary,
  CareerFilter,
  CareerYear,
} from '../types/athlete.types';

/** Lower-cases and strips Vietnamese diacritics so "duc anh" finds "Đức Anh". */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim();
}

export function filterAthletes(
  query: string,
  discipline: AthleteDisciplineFilter,
): readonly AthleteSummary[] {
  const needle = normalizeSearchText(query);

  return ATHLETES.filter(athlete => {
    if (discipline !== 'Tất cả' && !athlete.disciplines.includes(discipline)) {
      return false;
    }
    return (
      needle === '' ||
      normalizeSearchText(`${athlete.name} ${athlete.team}`).includes(needle)
    );
  });
}

/** Resolves a route parameter that may be an id or a legacy display name. */
export function findAthlete(idOrName: string): AthleteSummary | undefined {
  return ATHLETES.find(
    athlete => athlete.id === idOrName || athlete.name === idOrName,
  );
}

export function findAthleteProfile(
  idOrName: string,
  finalPlayed: boolean,
): AthleteProfile | undefined {
  const athlete = findAthlete(idOrName);
  return athlete?.hasProfile ? buildFeaturedProfile(finalPlayed) : undefined;
}

export function filterCareer(
  career: readonly CareerYear[],
  filter: CareerFilter,
): readonly CareerYear[] {
  if (filter === 'Tất cả') {
    return career;
  }

  return career
    .map(year => ({
      year: year.year,
      items: year.items.filter(item => {
        if (filter === 'Cột mốc') {
          return item.kind === 'milestone';
        }
        if (item.kind === 'milestone') {
          return false;
        }
        return filter === 'Huy chương' ? item.isMedal : item.hasVideo;
      }),
    }))
    .filter(year => year.items.length > 0);
}
