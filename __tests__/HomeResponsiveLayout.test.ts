import { resolveResponsiveMetrics } from '@jujistu/shared/constants/responsive';

import { resolveHomeHeroGeometry } from '../src/features/home/components/HomeHeroCarousel';
import { resolveHomeNewsCardWidth } from '../src/features/home/components/HomeNewsSection';

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
      const newsCardWidth = resolveHomeNewsCardWidth(metrics);

      expect(hero.activeWidth).toBeLessThan(width);
      expect(hero.inactiveWidth).toBeLessThan(hero.activeWidth);
      expect(newsCardWidth * 2 + 10 + 32).toBeLessThanOrEqual(width);
      if (metrics.isTablet) {
        expect(newsCardWidth).toBe(339);
      } else {
        expect(newsCardWidth).toBeLessThanOrEqual(239);
      }
    },
  );

  it('scales hero and news geometry up on tablet viewports', () => {
    const portraitTablet = resolveResponsiveMetrics({
      width: 800,
      height: 1280,
      scale: 2,
      fontScale: 1,
    });
    const landscapeTablet = resolveResponsiveMetrics({
      width: 1280,
      height: 800,
      scale: 2,
      fontScale: 1,
    });

    const portraitHero = resolveHomeHeroGeometry(portraitTablet);
    const landscapeHero = resolveHomeHeroGeometry(landscapeTablet);

    expect(portraitHero.activeWidth).toBeGreaterThan(450);
    expect(landscapeHero.activeWidth).toBeGreaterThan(450);
    expect(portraitHero.activeHeight).toBeGreaterThan(250);
    expect(landscapeHero.activeHeight).toBeGreaterThan(250);

    expect(resolveHomeNewsCardWidth(portraitTablet)).toBe(339);
    expect(resolveHomeNewsCardWidth(landscapeTablet)).toBe(339);
  });
});
