import React from 'react';
import { StyleSheet, View } from 'react-native';

import { semanticColors } from '@jujistu/shared/theme';

export interface OverlayProps {
  visible: boolean;
}

export function AppOverlay({ visible }: OverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, styles.overlay]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 1,
    backgroundColor: semanticColors.background.overlay,
  },
});
