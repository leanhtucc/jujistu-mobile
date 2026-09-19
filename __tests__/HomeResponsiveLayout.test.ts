import { resolveResponsiveMetrics } from '@jujistu/shared/constants/responsive';

import { resolveHomeHeroGeometry } from '../src/features/home/sections/HomeHeroCarousel';
import { resolveHomeNewsCardWidth } from '../src/features/home/sections/HomeNewsSection';

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 843 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
  { width: 800, height: 1280 },
] as const;

describe('Home responsive layout', () => {
  it('matches the Figma hero and news geometry at 390px', () => {
    const metrics = resolveResponsiveMetrics({
      width: 390,
      height: 843,
      scale: 3,
      fontScale: 1,
    });
    const hero = resolveHomeHeroGeometry(metrics);

    expect(hero.activeWidth).toBeCloseTo(281);
    expect(hero.activeHeight).toBeCloseTo(158.0625);
    expect(hero.inactiveWidth).toBeCloseTo(222);
    expect(hero.inactiveHeight).toBeCloseTo(125);
    expect(resolveHomeNewsCardWidth(metrics.width)).toBe(174);
  });

  it.each(viewports)(
    'keeps Home content bounded at $width x $height',
    ({ height, width }) => {
      const metrics = resolveResponsiveMetrics({
        width,
        height,
        scale: 2,
        fontScale: 1,
      });
      const hero = resolveHomeHeroGeometry(metrics);
      const newsCardWidth = resolveHomeNewsCardWidth(width);

      expect(hero.activeWidth).toBeLessThan(width);
      expect(hero.inactiveWidth).toBeLessThan(hero.activeWidth);
      expect(newsCardWidth * 2 + 10 + 32).toBeLessThanOrEqual(width);
      expect(newsCardWidth).toBeLessThanOrEqual(239);
    },
  );
});
