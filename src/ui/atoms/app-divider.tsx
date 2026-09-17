import React from 'react';
import {
  type DimensionValue,
  StyleSheet,
  type ViewStyle,
  View,
} from 'react-native';

import { borderWidth, semanticColors } from '@jujistu/shared/theme';

export type DividerDirection = 'horizontal' | 'vertical';

export interface DividerProps {
  direction?: DividerDirection;
  length?: DimensionValue;
}

export function AppDivider({ direction = 'horizontal', length }: DividerProps) {
  const isHorizontal = direction === 'horizontal';
  const resolvedLength = length ?? (isHorizontal ? 161 : 58);
  const lengthStyle: ViewStyle = isHorizontal
    ? { width: resolvedLength }
    : { height: resolvedLength };

  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[isHorizontal ? styles.horizontal : styles.vertical, lengthStyle]}
    >
      <View
        style={isHorizontal ? styles.horizontalLine : styles.verticalLine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 16,
    justifyContent: 'center',
  },
  vertical: {
    width: borderWidth.thin,
  },
  horizontalLine: {
    width: '100%',
    height: borderWidth.thin,
    backgroundColor: semanticColors.border.subtle,
  },
  verticalLine: {
    width: borderWidth.thin,
    height: '100%',
    backgroundColor: semanticColors.border.subtle,
  },
});
