import { useMemo } from 'react';
import { PixelRatio, type ScaledSize, useWindowDimensions } from 'react-native';

/**
 * Responsive classes are based on the usable React Native window, not a device
 * model. This keeps layouts correct during rotation, split-screen, Stage Manager,
 * Display Zoom and Android display-size changes.
 *
 * Typical examples (logical dp/pt, values vary with system UI settings):
 * - compactPhone: older iPhone SE and narrow Android phones
 * - phone: Pixel 2/3, current non-Max iPhones and regular Android phones
 * - largePhone: Pixel 7/8/9 Pro, iPhone Pro Max and Android foldable cover screens
 * - tablet: iPad mini, regular iPad, Pixel Tablet and medium Android tablets
 * - largeTablet: large iPad Pro and large Android tablets
 */
export type ResponsiveSizeClass =
  | 'compactPhone'
  | 'phone'
  | 'largePhone'
  | 'tablet'
  | 'largeTablet';

export type ResponsiveOrientation = 'portrait' | 'landscape';

export interface ResponsiveMetrics extends ScaledSize {
  readonly sizeClass: ResponsiveSizeClass;
  readonly orientation: ResponsiveOrientation;
  readonly shortestSide: number;
  readonly longestSide: number;
  readonly isPortrait: boolean;
  readonly isLandscape: boolean;
  readonly isPhone: boolean;
  readonly isTablet: boolean;
  readonly isCompactPhone: boolean;
  readonly isLargePhone: boolean;
  readonly isLargeTablet: boolean;
}

export interface ResponsiveValues<T> {
  readonly compactPhone: T;
  readonly phone?: T;
  readonly largePhone?: T;
  readonly tablet?: T;
  readonly largeTablet?: T;
}

export interface ResponsiveScaleOptions {
  readonly baseShortestSide?: number;
  readonly minScale?: number;
  readonly maxScale?: number;
  readonly roundToPixel?: boolean;
}

export const responsiveBreakpoints = Object.freeze({
  compactLongestSide: 700,
  compactShortestSide: 360,
  phoneLongestSide: 850,
  phoneShortestSide: 400,
  tabletShortestSide: 600,
  largeTabletShortestSide: 900,
});

export function resolveResponsiveMetrics(
  window: Pick<ScaledSize, 'width' | 'height' | 'scale' | 'fontScale'>,
): ResponsiveMetrics {
  const shortestSide = Math.min(window.width, window.height);
  const longestSide = Math.max(window.width, window.height);
  const isLandscape = window.width > window.height;
  let sizeClass: ResponsiveSizeClass;

  if (
    shortestSide < responsiveBreakpoints.compactShortestSide ||
    longestSide < responsiveBreakpoints.compactLongestSide
  ) {
    sizeClass = 'compactPhone';
  } else if (
    shortestSide < responsiveBreakpoints.phoneShortestSide ||
    longestSide < responsiveBreakpoints.phoneLongestSide
  ) {
    sizeClass = 'phone';
  } else if (shortestSide < responsiveBreakpoints.tabletShortestSide) {
    sizeClass = 'largePhone';
  } else if (shortestSide < responsiveBreakpoints.largeTabletShortestSide) {
    sizeClass = 'tablet';
  } else {
    sizeClass = 'largeTablet';
  }

  const isTablet = sizeClass === 'tablet' || sizeClass === 'largeTablet';

  return {
    ...window,
    sizeClass,
    orientation: isLandscape ? 'landscape' : 'portrait',
    shortestSide,
    longestSide,
    isPortrait: !isLandscape,
    isLandscape,
    isPhone: !isTablet,
    isTablet,
    isCompactPhone: sizeClass === 'compactPhone',
    isLargePhone: sizeClass === 'largePhone',
    isLargeTablet: sizeClass === 'largeTablet',
  };
}

export function useResponsive(): ResponsiveMetrics {
  const { fontScale, height, scale, width } = useWindowDimensions();

  return useMemo(
    () => resolveResponsiveMetrics({ fontScale, height, scale, width }),
    [fontScale, height, scale, width],
  );
}

export function selectResponsiveValue<T>(
  metrics: Pick<ResponsiveMetrics, 'sizeClass'>,
  values: ResponsiveValues<T>,
): T {
  const orderedClasses: readonly ResponsiveSizeClass[] = [
    'compactPhone',
    'phone',
    'largePhone',
    'tablet',
    'largeTablet',
  ];
  const currentIndex = orderedClasses.indexOf(metrics.sizeClass);
  let selected = values.compactPhone;

  for (let index = 1; index <= currentIndex; index += 1) {
    const candidate = values[orderedClasses[index]];
    if (candidate !== undefined) {
      selected = candidate;
    }
  }

  return selected;
}

export function selectOrientationValue<T>(
  metrics: Pick<ResponsiveMetrics, 'orientation'>,
  values: Readonly<{ portrait: T; landscape: T }>,
): T {
  return values[metrics.orientation];
}

/**
 * Scales a design value using the shortest side, then clamps it so tablets do
 * not produce oversized controls. Font scale is intentionally not divided out:
 * React Native accessibility font scaling remains respected.
 */
export function scaleResponsiveValue(
  value: number,
  metrics: Pick<ResponsiveMetrics, 'shortestSide'>,
  options: ResponsiveScaleOptions = {},
): number {
  const {
    baseShortestSide = 390,
    minScale = 0.88,
    maxScale = 1.3,
    roundToPixel = true,
  } = options;
  const rawScale = metrics.shortestSide / baseShortestSide;
  const scale = Math.min(maxScale, Math.max(minScale, rawScale));
  const result = value * scale;

  return roundToPixel ? PixelRatio.roundToNearestPixel(result) : result;
}

export function getResponsiveContentWidth(
  metrics: Pick<ResponsiveMetrics, 'width' | 'sizeClass'>,
  horizontalGutter = 16,
): number {
  const availableWidth = Math.max(0, metrics.width - horizontalGutter * 2);
  const maxWidth = selectResponsiveValue(metrics, {
    compactPhone: availableWidth,
    phone: 520,
    largePhone: 600,
    tablet: 720,
    largeTablet: 960,
  });

  return Math.min(availableWidth, maxWidth);
}
