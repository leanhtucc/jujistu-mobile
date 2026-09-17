import { semanticColors } from './semantic/colors';
import { semanticGradients } from './semantic/gradients';
import { componentTypography, typography } from './semantic/typography';
import {
  borderWidth,
  elevation,
  fontFamilies,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  opacity,
  primitiveColors,
  radius,
  spacing,
} from './tokens';

export const theme = {
  colors: semanticColors,
  gradients: semanticGradients,
  primitives: {
    colors: primitiveColors,
    fontFamilies,
    fontSizes,
    fontWeights,
    lineHeights,
    letterSpacings,
  },
  typography,
  componentTypography,
  spacing,
  radius,
  borderWidth,
  opacity,
  elevation,
} as const;

export type Theme = typeof theme;
