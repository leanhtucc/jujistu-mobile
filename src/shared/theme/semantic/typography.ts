import type { TextStyle } from 'react-native';
import { fontFamilies, fontWeights } from '../tokens/typography';

export const typography = {
  heading: {
    lg: {
      fontFamily: fontFamilies.primary.bold,
      fontSize: 18,
      lineHeight: 23.4,
      fontWeight: fontWeights.bold,
      letterSpacing: -0.18,
    },
    md: {
      fontFamily: fontFamilies.primary.bold,
      fontSize: 16,
      lineHeight: 20,
      fontWeight: fontWeights.bold,
      letterSpacing: -0.16,
    },
    sm: {
      fontFamily: fontFamilies.primary.bold,
      fontSize: 14,
      lineHeight: 19.6,
      fontWeight: fontWeights.bold,
      letterSpacing: -0.14,
    },
    xs: {
      fontFamily: fontFamilies.primary.bold,
      fontSize: 12,
      lineHeight: 15,
      fontWeight: fontWeights.bold,
      letterSpacing: -0.12,
    },
  },

  body: {
    md: {
      fontFamily: fontFamilies.primary.regular,
      fontSize: 14,
      lineHeight: 19.6,
      fontWeight: fontWeights.regular,
      letterSpacing: -0.14,
    },
    sm: {
      fontFamily: fontFamilies.primary.regular,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: fontWeights.regular,
      letterSpacing: 0,
    },
  },

  label: {
    lg: {
      fontFamily: fontFamilies.primary.medium,
      fontSize: 18,
      lineHeight: 27,
      fontWeight: fontWeights.medium,
      letterSpacing: 0,
    },
    md: {
      fontFamily: fontFamilies.primary.medium,
      fontSize: 14,
      lineHeight: 19.6,
      fontWeight: fontWeights.medium,
      letterSpacing: -0.14,
    },
    sm: {
      fontFamily: fontFamilies.primary.medium,
      fontSize: 12,
      lineHeight: 15,
      fontWeight: fontWeights.medium,
      letterSpacing: 0,
    },
  },

  caption: {
    sm: {
      fontFamily: fontFamilies.primary.medium,
      fontSize: 10,
      lineHeight: 12,
      fontWeight: fontWeights.medium,
      letterSpacing: -0.1,
    },
    xs: {
      fontFamily: fontFamilies.primary.medium,
      fontSize: 10,
      lineHeight: 10,
      fontWeight: fontWeights.medium,
      letterSpacing: -0.1,
    },
  },
} as const satisfies Record<string, Record<string, TextStyle>>;

export const componentTypography = {
  button: {
    fontFamily: fontFamilies.primary.semiBold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeights.semiBold,
    letterSpacing: 0,
  },
  inputPlaceholder: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: 14,
    lineHeight: 14,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  },
} as const satisfies Record<string, TextStyle>;

export type Typography = typeof typography;
export type ComponentTypography = typeof componentTypography;
