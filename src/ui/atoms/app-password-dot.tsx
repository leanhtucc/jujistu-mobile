import React from 'react';
import { StyleSheet, View } from 'react-native';

import { borderWidth, radius, semanticColors } from '@jujistu/shared/theme';

export type PasswordDotSize = 'small' | 'medium' | 'large';
export type PasswordDotState = 'filled' | 'empty' | 'disabled';

export interface PasswordDotProps {
  size?: PasswordDotSize;
  state?: PasswordDotState;
}

const dimensions: Record<PasswordDotSize, number> = {
  small: 8,
  medium: 10,
  large: 12,
};

const stateStyles = StyleSheet.create({
  filled: {
    backgroundColor: semanticColors.icon.primary,
    borderColor: 'transparent',
  },
  empty: {
    backgroundColor: semanticColors.background.surfaceSubtle,
    borderColor: semanticColors.border.strong,
  },
  disabled: {
    backgroundColor: semanticColors.icon.tertiary,
    borderColor: 'transparent',
  },
});

export function AppPasswordDot({
  size = 'small',
  state = 'filled',
}: PasswordDotProps) {
  const dimension = dimensions[size];

  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[
        styles.dot,
        stateStyles[state],
        { width: dimension, height: dimension },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    borderWidth: borderWidth.thin,
    borderRadius: radius.full,
  },
});
