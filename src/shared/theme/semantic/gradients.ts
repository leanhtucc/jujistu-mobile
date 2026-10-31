import { primitiveColors } from '../tokens/colors';

export const semanticGradients = {
  action: {
    primary: {
      start: primitiveColors.red[700],
      middle: primitiveColors.red[500],
      end: primitiveColors.orange[500],
    },
  },
  surface: {
    quickAction: {
      start: primitiveColors.neutral[825],
      end: primitiveColors.neutral[650],
    },
    scrimBottom: {
      start: 'rgba(11, 10, 10, 0)',
      middle: 'rgba(11, 10, 10, 0.72)',
      end: '#0B0A0A',
    },
    emberGlow: {
      start: primitiveColors.alpha.orange55,
      middle: primitiveColors.alpha.red24,
      end: 'rgba(11, 10, 10, 0)',
    },
  },
} as const;

export type SemanticGradients = typeof semanticGradients;
