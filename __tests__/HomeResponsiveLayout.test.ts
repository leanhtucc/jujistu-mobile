import { resolveResponsiveMetrics } from '@jujistu/shared/constants/responsive';

import { resolveHomeHeroGeometry } from '../src/features/home/components/HomeHeroCarousel';
import { resolveHomeEventCardWidth } from '../src/features/home/components/HomeEventTicketSection';
import { resolveHomeFeaturedVideoGeometry } from '../src/features/home/components/HomeFeaturedVideoSection';
import { resolveHomeNewsGeometry } from '../src/features/home/components/HomeNewsSection';
import { resolveHomeQuickActionGeometry } from '../src/features/home/components/HomeQuickActions';

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 843 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
  { width: 800, height: 1280 },
] as const;

describe('Home responsive layout', () => {
  it('preserves the base feed geometry while widening the hero at 390px', () => {
    const metrics = resolveResponsiveMetrics({
      width: 390,
      height: 843,
      scale: 3,
      fontScale: 1,
    });
    const hero = resolveHomeHeroGeometry(metrics);

    expect(hero.activeWidth).toBeCloseTo(304.2);
    expect(hero.activeHeight).toBeCloseTo(171.11, 1);
    expect(hero.inactiveWidth).toBeCloseTo(240.33, 1);
    expect(hero.inactiveHeight).toBeCloseTo(135.32, 1);
    expect(resolveHomeNewsGeometry(metrics.width)).toEqual({
      contentGap: 19,
      imageHeight: 87,
      imageWidth: 156,
      scale: 1,
      sectionWidth: 360,
    });
    expect(resolveHomeQuickActionGeometry(metrics.width)).toEqual({
      columnGap: 23,
      gridWidth: 358,
      itemWidth: 104,
    });
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
      const eventCardWidth = resolveHomeEventCardWidth(metrics.width);
      const featuredVideos = resolveHomeFeaturedVideoGeometry(metrics.width);
      const news = resolveHomeNewsGeometry(metrics.width);
      const quickActions = resolveHomeQuickActionGeometry(metrics.width);

      expect(hero.activeWidth).toBeLessThan(width);
      expect(hero.inactiveWidth).toBeLessThan(hero.activeWidth);
      expect(news.sectionWidth + 30).toBeLessThanOrEqual(width);
      expect(eventCardWidth + 31).toBeLessThanOrEqual(width);
      expect(featuredVideos.sectionWidth + 26).toBeLessThanOrEqual(width);
      expect(featuredVideos.cardWidth * 2 + featuredVideos.cardGap).toBeCloseTo(
        featuredVideos.sectionWidth,
      );
      expect(quickActions.gridWidth + 32).toBeLessThanOrEqual(width);
      expect(
        quickActions.itemWidth * 3 + quickActions.columnGap * 2,
      ).toBeCloseTo(quickActions.gridWidth);
    },
  );

  it('scales the hero and caps feed sections at readable tablet widths', () => {
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

    expect(resolveHomeNewsGeometry(portraitTablet.width).sectionWidth).toBe(
      720,
    );
    expect(resolveHomeNewsGeometry(landscapeTablet.width).sectionWidth).toBe(
      720,
    );
  });

  it('uses the available Pixel 8 Pro width instead of phone-sized caps', () => {
    const pixel8Pro = resolveResponsiveMetrics({
      width: 448,
      height: 998,
      scale: 3,
      fontScale: 1,
    });

    expect(pixel8Pro.sizeClass).toBe('largePhone');
    expect(resolveHomeHeroGeometry(pixel8Pro).activeWidth).toBeGreaterThan(340);
    expect(resolveHomeQuickActionGeometry(pixel8Pro.width).gridWidth).toBe(416);
    expect(resolveHomeEventCardWidth(pixel8Pro.width)).toBe(417);
    expect(resolveHomeFeaturedVideoGeometry(pixel8Pro.width).sectionWidth).toBe(
      422,
    );
    expect(resolveHomeNewsGeometry(pixel8Pro.width).sectionWidth).toBe(418);
  });
});
