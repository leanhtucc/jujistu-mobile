import type { ViewStyle } from 'react-native';

import {
  fontFamilies,
  radius,
  semanticColors,
  spacing,
} from '@jujistu/shared/theme';

import type { TooltipDirection, TooltipStyle } from './tooltip.types';

export interface TooltipColors {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  textColor: string;
}

export const ARROW_HEIGHT = 8;
export const ARROW_WIDTH = 16;

export function resolveTooltipColors(
  styleVariant: TooltipStyle = 'solid',
): TooltipColors {
  if (styleVariant === 'soft') {
    return {
      backgroundColor: semanticColors.background.surfaceSubtle,
      borderColor: semanticColors.border.subtle,
      borderWidth: 1,
      textColor: semanticColors.text.primary,
    };
  }

  return {
    backgroundColor: semanticColors.background.surfaceElevated,
    borderColor: semanticColors.border.strong,
    borderWidth: 1,
    textColor: semanticColors.text.primary,
  };
}

export function getTooltipDirectionStyle(
  direction: TooltipDirection,
): ViewStyle {
  switch (direction) {
    case 'top':
      return {
        alignItems: 'center',
        flexDirection: 'column',
      };
    case 'bottom':
      return {
        alignItems: 'center',
        flexDirection: 'column-reverse',
      };
    case 'left':
      return {
        alignItems: 'center',
        flexDirection: 'row',
      };
    case 'right':
      return {
        alignItems: 'center',
        flexDirection: 'row-reverse',
      };
  }
}

export function getArrowSvgProps(direction: TooltipDirection) {
  switch (direction) {
    case 'top':
      return {
        width: ARROW_WIDTH,
        height: ARROW_HEIGHT,
        points: `0,0 ${ARROW_WIDTH},0 ${ARROW_WIDTH / 2},${ARROW_HEIGHT}`,
      };
    case 'bottom':
      return {
        width: ARROW_WIDTH,
        height: ARROW_HEIGHT,
        points: `${
          ARROW_WIDTH / 2
        },0 ${ARROW_WIDTH},${ARROW_HEIGHT} 0,${ARROW_HEIGHT}`,
      };
    case 'left':
      return {
        width: ARROW_HEIGHT,
        height: ARROW_WIDTH,
        points: `0,0 0,${ARROW_WIDTH} ${ARROW_HEIGHT},${ARROW_WIDTH / 2}`,
      };
    case 'right':
      return {
        width: ARROW_HEIGHT,
        height: ARROW_WIDTH,
        points: `${ARROW_HEIGHT},0 ${ARROW_HEIGHT},${ARROW_WIDTH} 0,${
          ARROW_WIDTH / 2
        }`,
      };
  }
}

export const tooltipTheme = {
  borderRadius: radius.md, // 8
  paddingHorizontal: spacing[8], // 16
  paddingVertical: spacing[5], // 10
  fontFamily: fontFamilies.primary.medium,
};
