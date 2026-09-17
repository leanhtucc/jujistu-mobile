import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, semanticColors } from '@jujistu/shared/theme';

import { PrimaryGradientFill } from '../utils/primary-gradient-fill';
import {
  resolveSelectionControlLabelColor,
  SELECTION_CONTROL_GAP,
  selectionControlSizeRecipes,
  type SelectionControlSize,
} from './selection-control-theme';

export type RadioSize = SelectionControlSize;

export interface RadioProps {
  checked: boolean;
  onPress: () => void;
  size: RadioSize;
  disabled?: boolean;
  label?: string;
  accessibilityLabel?: string;
}

export function AppRadio({
  checked,
  onPress,
  size,
  disabled = false,
  label,
  accessibilityLabel,
}: RadioProps) {
  const recipe = selectionControlSizeRecipes[size];

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={disabled ? undefined : onPress}
      style={styles.container}
    >
      <View
        style={[
          styles.slot,
          { width: recipe.slotSize, height: recipe.slotSize },
        ]}
      >
        <View
          style={[
            styles.radio,
            {
              width: recipe.controlSize,
              height: recipe.controlSize,
              borderWidth: recipe.borderWidth,
            },
            checked
              ? disabled
                ? styles.selectedDisabled
                : styles.selected
              : disabled
              ? styles.unselectedDisabled
              : styles.unselected,
          ]}
        >
          {checked && !disabled ? <PrimaryGradientFill /> : null}
          {checked ? (
            <View
              style={[
                styles.indicator,
                {
                  width: recipe.controlSize / 3.5,
                  height: recipe.controlSize / 3.5,
                  backgroundColor: disabled
                    ? semanticColors.icon.tertiary
                    : semanticColors.icon.primary,
                },
              ]}
            />
          ) : null}
        </View>
      </View>

      {label !== undefined ? (
        <Text
          numberOfLines={1}
          style={[
            recipe.labelStyle,
            { color: resolveSelectionControlLabelColor(disabled) },
          ]}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SELECTION_CONTROL_GAP,
  },
  slot: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    overflow: 'hidden',
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    borderRadius: radius.full,
  },
  unselected: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.strong,
  },
  unselectedDisabled: {
    backgroundColor: semanticColors.background.surfaceSubtle,
    borderColor: semanticColors.border.default,
  },
  selected: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  selectedDisabled: {
    borderWidth: 0,
    backgroundColor: semanticColors.background.surfaceElevated,
    borderColor: semanticColors.background.surfaceElevated,
  },
});
