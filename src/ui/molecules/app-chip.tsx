import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';

export interface ChipProps {
  readonly label: string;
  readonly selected?: boolean;
  readonly onPress?: () => void;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
}

export function AppChip({
  label,
  selected = false,
  onPress,
  accessibilityLabel,
  testID,
}: ChipProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        selected ? styles.selected : styles.idle,
        // Selected chips tilt slightly, like a strip of tape (design system).
        selected ? styles.tilt : null,
        pressed ? styles.pressed : null,
      ]}
      testID={testID}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected
              ? semanticColors.text.accent
              : semanticColors.text.secondary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  idle: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.default,
  },
  selected: {
    backgroundColor: semanticColors.background.accentTint,
    borderColor: semanticColors.border.accent,
  },
  tilt: { transform: [{ rotate: '-2deg' }] },
  pressed: { transform: [{ scale: 0.97 }] },
  label: dsTypography.bodyStrong,
});
