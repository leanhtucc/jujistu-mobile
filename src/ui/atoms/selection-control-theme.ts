import type { TextStyle } from 'react-native';

import {
  fontFamilies,
  fontSizes,
  fontWeights,
  semanticColors,
  spacing,
  typography,
} from '@jujistu/shared/theme';

export type SelectionControlSize = 'sm' | 'md' | 'lg';

interface SelectionControlSizeRecipe {
  slotSize: number;
  controlSize: number;
  borderWidth: number;
  cornerRadius: number;
  indicatorStrokeWidth: number;
  labelStyle: TextStyle;
}

export const SELECTION_CONTROL_GAP = spacing[2];

export const selectionControlSizeRecipes: Record<
  SelectionControlSize,
  SelectionControlSizeRecipe
> = {
  sm: {
    slotSize: 24,
    controlSize: 14,
    borderWidth: 2,
    cornerRadius: 2,
    indicatorStrokeWidth: 1.5,
    labelStyle: typography.label.sm,
  },
  md: {
    slotSize: 28,
    controlSize: 16.333,
    borderWidth: 2.333,
    cornerRadius: 2.333,
    indicatorStrokeWidth: 1.75,
    labelStyle: typography.label.md,
  },
  lg: {
    slotSize: 36,
    controlSize: 21,
    borderWidth: 3,
    cornerRadius: 3,
    indicatorStrokeWidth: 2.25,
    labelStyle: {
      fontFamily: fontFamilies.primary.medium,
      fontSize: fontSizes[16],
      lineHeight: 24,
      fontWeight: fontWeights.medium,
      letterSpacing: -0.16,
    },
  },
};

export function resolveSelectionControlLabelColor(disabled: boolean): string {
  return disabled ? semanticColors.text.tertiary : semanticColors.text.primary;
}
