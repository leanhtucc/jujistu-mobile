import React from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, semanticColors } from '@jujistu/shared/theme';

import { PrimaryGradientFill } from '../utils/primary-gradient-fill';

export type PaginationDotSize = 'small' | 'medium' | 'large';

export interface PaginationDotProps {
  size?: PaginationDotSize;
  active?: boolean;
}

const sizeRecipes = {
  small: { height: 6, activeWidth: 16 },
  medium: { height: 8, activeWidth: 20 },
  large: { height: 10, activeWidth: 24 },
} as const;

export function AppPaginationDot({
  size = 'small',
  active = false,
}: PaginationDotProps) {
  const recipe = sizeRecipes[size];

  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[
        styles.dot,
        {
          width: active ? recipe.activeWidth : recipe.height,
          height: recipe.height,
          backgroundColor: active ? undefined : semanticColors.icon.tertiary,
        },
      ]}
    >
      {active ? <PrimaryGradientFill /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    overflow: 'hidden',
    borderRadius: radius.full,
  },
});
