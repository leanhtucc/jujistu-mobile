import { primitiveColors } from '../tokens/colors';

export const semanticGradients = {
  action: {
    primary: {
      start: primitiveColors.red[700],
      end: primitiveColors.orange[500],
    },
  },
} as const;

export type SemanticGradients = typeof semanticGradients;
