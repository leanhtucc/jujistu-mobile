import { Platform } from 'react-native';

/**
 * Primitive font families architecture.
 *
 * Runtime font assets are linked in the Android and iOS native projects.
 * Platform-specific family names keep weight selection deterministic.
 */
export const fontFamilies = {
  primary: {
    regular: Platform.select({
      ios: 'Barlow',
      android: 'Barlow-Regular',
      default: 'Barlow',
    }),
    medium: Platform.select({
      ios: 'Barlow',
      android: 'Barlow-Medium',
      default: 'Barlow',
    }),
    semiBold: Platform.select({
      ios: 'Barlow',
      android: 'Barlow-SemiBold',
      default: 'Barlow',
    }),
    bold: Platform.select({
      ios: 'Barlow',
      android: 'Barlow-Bold',
      default: 'Barlow',
    }),
  },
  display: {
    regular: Platform.select({
      ios: 'Esport Woglen',
      android: 'EsportWoglen-Regular',
      default: 'Esport Woglen',
    }),
  },
} as const;

export const fontSizes = {
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const lineHeights = {
  10: 10,
  12: 12,
  14: 14,
  15: 15,
  18: 18,
  19.6: 19.6,
  20: 20,
  23.4: 23.4,
  27: 27,
  30: 30,
} as const;

export const letterSpacings = {
  none: 0,
  tight10: -0.1,
  tight12: -0.12,
  tight14: -0.14,
  tight16: -0.16,
  tight18: -0.18,
} as const;

export type FontFamilies = typeof fontFamilies;
export type FontSizes = typeof fontSizes;
export type FontWeights = typeof fontWeights;
export type LineHeights = typeof lineHeights;
export type LetterSpacings = typeof letterSpacings;
