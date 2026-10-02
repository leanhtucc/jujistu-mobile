import { semanticColors } from '@jujistu/shared/theme';
import { AppIcon } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function FullscreenGlyph() {
  return (
    <View accessible={false} importantForAccessibility="no" style={styles.root}>
      <AppIcon
        color={semanticColors.icon.primary}
        name="fullscreenTopLeft"
        size={6}
        style={styles.topLeft}
      />
      <AppIcon
        color={semanticColors.icon.primary}
        name="fullscreenTopRight"
        size={6}
        style={styles.topRight}
      />
      <AppIcon
        color={semanticColors.icon.primary}
        name="fullscreenBottomRight"
        size={6}
        style={styles.bottomRight}
      />
      <AppIcon
        color={semanticColors.icon.primary}
        name="fullscreenBottomLeft"
        size={6}
        style={styles.bottomLeft}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 16,
    height: 16,
  },
  topLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
