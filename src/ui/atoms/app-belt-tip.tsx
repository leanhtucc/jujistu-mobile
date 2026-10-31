import React from 'react';
import { StyleSheet, View } from 'react-native';

import { primitiveColors, semanticColors } from '@jujistu/shared/theme';

import { AppIcon } from './icon';

export const BELT_TIP_WIDTH = 44;

/** Dark rank-bar segment that closes a primary button, like a belt end. */
export function AppBeltTip() {
  return (
    <View pointerEvents="none" style={styles.root} testID="app-belt-tip">
      <View style={styles.stripe} />
      <View style={styles.stripe} />
      <AppIcon
        accessible={false}
        color={semanticColors.text.primary}
        name="arrowRight"
        size={14}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: primitiveColors.neutral[1000],
    bottom: 0,
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: BELT_TIP_WIDTH,
    zIndex: 2,
  },
  stripe: {
    backgroundColor: primitiveColors.gi[100],
    height: '46%',
    width: 2,
  },
});
