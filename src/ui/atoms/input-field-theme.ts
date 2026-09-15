import {
  borderWidth,
  primitiveColors,
  radius,
  semanticColors,
  spacing,
} from '@jujistu/shared/theme';

import type { InputFieldSize } from './input-field.types';

export type InputVisualState = 'default' | 'focused' | 'filled' | 'error';

export interface InputFieldSizeRecipe {
  height: number;
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  borderRadius: number;
  borderWidth: number;
}

export interface InputFieldVisualRecipe {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  placeholderColor: string;
  opacity: number;
  usesFocusedGradient: boolean;
}

const inputFieldComponentTokens = {
  surface: primitiveColors.neutral[750],
} as const;

export const inputFieldFocusedGradient = {
  // Figma's two affine rows become SVG's column-major [a, b, c, d, tx, ty].
  transform: [
    6.123234262925839e-17, -1, 1, 6.123234262925839e-17, 0, 1,
  ] as const,
  stops: [
    { offset: 0, opacity: 0.10000000149011612 },
    { offset: 0.6477574110031128, opacity: 0.019999999552965164 },
    { offset: 1, opacity: 0.20000000298023224 },
  ] as const,
} as const;

export function resolveInputVisualState({
  error,
  focused,
  value,
}: {
  error: boolean;
  focused: boolean;
  value: string;
}): InputVisualState {
  if (error) {
    return 'error';
  }

  if (focused) {
    return 'focused';
  }

  if (value.length > 0) {
    return 'filled';
  }

  return 'default';
}

export function resolveInputFieldSizeRecipe(
  size: InputFieldSize,
): InputFieldSizeRecipe {
  return {
    height: size === 'md' ? 52 : 40,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[5],
    gap: spacing[3],
    borderRadius: radius.xs,
    borderWidth: borderWidth.thin,
  };
}

export function resolveInputFieldVisualRecipe(
  state: InputVisualState,
): InputFieldVisualRecipe {
  const common = {
    backgroundColor: inputFieldComponentTokens.surface,
    borderColor: inputFieldComponentTokens.surface,
    opacity: 1,
  } as const;

  if (state === 'error') {
    return {
      ...common,
      borderColor: semanticColors.border.error,
      textColor: semanticColors.text.error,
      placeholderColor: semanticColors.text.error,
      usesFocusedGradient: false,
    };
  }

  if (state === 'focused') {
    return {
      ...common,
      textColor: semanticColors.text.primary,
      placeholderColor: semanticColors.text.tertiary,
      usesFocusedGradient: true,
    };
  }

  return {
    ...common,
    textColor:
      state === 'filled'
        ? semanticColors.text.primary
        : semanticColors.text.tertiary,
    placeholderColor: semanticColors.text.tertiary,
    usesFocusedGradient: false,
  };
}
