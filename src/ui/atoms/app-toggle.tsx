import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { opacity, radius, semanticColors } from '@jujistu/shared/theme';

import { PrimaryGradientFill } from '../utils/primary-gradient-fill';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function AppToggle({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: ToggleProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={12}
      onPress={disabled ? undefined : () => onValueChange(!value)}
      style={[styles.track, disabled ? styles.disabled : undefined]}
    >
      {value ? <PrimaryGradientFill /> : null}
      <View
        style={[
          styles.thumb,
          value ? styles.thumbActive : styles.thumbInactive,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 40,
    height: 20,
    padding: 2,
    overflow: 'hidden',
    borderRadius: radius.full,
    justifyContent: 'center',
    backgroundColor: semanticColors.background.surfaceElevated,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: semanticColors.icon.primary,
  },
  thumbInactive: {
    alignSelf: 'flex-start',
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
});
