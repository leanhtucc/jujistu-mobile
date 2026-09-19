import {
  getResponsiveContentWidth,
  resolveResponsiveMetrics,
  scaleResponsiveValue,
  selectOrientationValue,
  selectResponsiveValue,
} from '@jujistu/shared/constants/responsive';

function windowSize(width: number, height: number) {
  return { width, height, scale: 3, fontScale: 1 };
}

describe('responsive utilities', () => {
  it.each([
    ['older iPhone SE', 320, 568, 'compactPhone'],
    ['iPhone SE', 375, 667, 'compactPhone'],
    ['Pixel 2', 411, 731, 'phone'],
    ['Pixel 3', 393, 786, 'phone'],
    ['iPhone 15 Pro', 393, 852, 'phone'],
    ['Pixel 7', 412, 915, 'largePhone'],
    ['Pixel 8 Pro', 448, 998, 'largePhone'],
    ['iPhone Pro Max', 430, 932, 'largePhone'],
    ['iPad mini', 744, 1133, 'tablet'],
    ['Pixel Tablet', 800, 1280, 'tablet'],
    ['iPad Pro 11', 834, 1194, 'tablet'],
    ['iPad Pro 13', 1024, 1366, 'largeTablet'],
  ] as const)(
    'classifies %s by its usable window',
    (_name, width, height, expected) => {
      expect(
        resolveResponsiveMetrics(windowSize(width, height)).sizeClass,
      ).toBe(expected);
    },
  );

  it('keeps the device class while changing orientation', () => {
    const portrait = resolveResponsiveMetrics(windowSize(800, 1280));
    const landscape = resolveResponsiveMetrics(windowSize(1280, 800));

    expect(portrait).toMatchObject({
      isPortrait: true,
      isTablet: true,
      orientation: 'portrait',
      sizeClass: 'tablet',
    });
    expect(landscape).toMatchObject({
      isLandscape: true,
      isTablet: true,
      orientation: 'landscape',
      sizeClass: 'tablet',
    });
  });

  it('uses compact-first cascading values when a class is omitted', () => {
    const tablet = resolveResponsiveMetrics(windowSize(800, 1280));

    expect(
      selectResponsiveValue(tablet, {
        compactPhone: 14,
        phone: 16,
        tablet: 20,
      }),
    ).toBe(20);
    expect(
      selectResponsiveValue(tablet, {
        compactPhone: 14,
        largePhone: 18,
      }),
    ).toBe(18);
  });

  it('selects orientation-specific values', () => {
    const landscape = resolveResponsiveMetrics(windowSize(1280, 800));

    expect(
      selectOrientationValue(landscape, {
        portrait: 'column',
        landscape: 'row',
      }),
    ).toBe('row');
  });

  it('clamps proportional scaling on small phones and tablets', () => {
    const compact = resolveResponsiveMetrics(windowSize(320, 568));
    const tablet = resolveResponsiveMetrics(windowSize(1024, 1366));

    expect(scaleResponsiveValue(100, compact, { roundToPixel: false })).toBe(
      88,
    );
    expect(scaleResponsiveValue(100, tablet, { roundToPixel: false })).toBe(
      130,
    );
  });

  it('caps centered content on tablets while phones use available width', () => {
    const phone = resolveResponsiveMetrics(windowSize(448, 998));
    const tabletLandscape = resolveResponsiveMetrics(windowSize(1280, 800));

    expect(getResponsiveContentWidth(phone)).toBe(416);
    expect(getResponsiveContentWidth(tabletLandscape)).toBe(720);
  });
});
