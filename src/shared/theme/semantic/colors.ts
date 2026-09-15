import { primitiveColors } from '../tokens/colors';

export const semanticColors = {
  background: {
    canvas: primitiveColors.neutral[900],
    canvasDeep: primitiveColors.neutral[1000],
    surface: primitiveColors.neutral[850],
    surfaceSubtle: primitiveColors.neutral[800],
    surfaceElevated: primitiveColors.neutral[750],
    overlay: primitiveColors.alpha.black80,
  },

  text: {
    primary: primitiveColors.neutral[0],
    secondary: primitiveColors.neutral[100],
    tertiary: primitiveColors.neutral[300],
    accent: primitiveColors.orange[500],
    error: primitiveColors.red[400],
    inverse: primitiveColors.neutral[900],
  },

  icon: {
    primary: primitiveColors.neutral[0],
    secondary: primitiveColors.neutral[100],
    tertiary: primitiveColors.neutral[300],
    error: primitiveColors.red[400],
    inverse: primitiveColors.neutral[900],
  },

  border: {
    default: primitiveColors.neutral[800],
    subtle: primitiveColors.alpha.white10,
    strong: primitiveColors.neutral[600],
    accent: primitiveColors.orange[500],
    error: primitiveColors.red[400],
  },

  action: {
    primary: primitiveColors.red[500],
    secondary: primitiveColors.neutral[750],
  },

  status: {
    error: primitiveColors.red[400],
  },
} as const;

export type SemanticColors = typeof semanticColors;
