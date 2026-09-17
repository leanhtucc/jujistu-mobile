import React from 'react';
import { StyleSheet, View } from 'react-native';

import { semanticColors } from '@jujistu/shared/theme';

import { PrimaryGradientFill } from '../utils/primary-gradient-fill';

export type ProgressStatus = 'completed' | 'upcoming';

export interface ProgressProps {
  status?: ProgressStatus;
}

export function AppProgress({ status = 'completed' }: ProgressProps) {
  const completed = status === 'completed';

  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[styles.segment, completed ? undefined : styles.upcoming]}
    >
      {completed ? <PrimaryGradientFill /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    width: 200,
    height: 8,
    overflow: 'hidden',
  },
  upcoming: {
    backgroundColor: semanticColors.background.surfaceSubtle,
  },
});
