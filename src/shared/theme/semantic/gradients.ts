import { primitiveColors } from '../tokens/colors';

export const semanticGradients = {
  action: {
    primary: {
      start: primitiveColors.red[700],
      end: primitiveColors.orange[500],
    },
  },
  surface: {
    quickAction: {
      start: primitiveColors.neutral[825],
      end: primitiveColors.neutral[650],
    },
  },
} as const;

export type SemanticGradients = typeof semanticGradients;
