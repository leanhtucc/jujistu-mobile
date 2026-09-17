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

export type CheckboxSize = SelectionControlSize;

export interface CheckboxProps {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  size: CheckboxSize;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  accessibilityLabel?: string;
}

export function AppCheckbox({
  checked,
  onValueChange,
  size,
  disabled = false,
  indeterminate = false,
  label,
  accessibilityLabel,
}: CheckboxProps) {
  const recipe = selectionControlSizeRecipes[size];
  const selected = checked || indeterminate;
  const accessibilityChecked = indeterminate ? 'mixed' : checked;
  const indicatorColor = disabled
    ? semanticColors.icon.tertiary
    : semanticColors.icon.primary;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: accessibilityChecked, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={disabled ? undefined : () => onValueChange(!checked)}
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
            styles.box,
            {
              width: recipe.controlSize,
              height: recipe.controlSize,
              borderWidth: recipe.borderWidth,
              borderRadius: recipe.cornerRadius,
            },
            selected
              ? disabled
                ? styles.selectedDisabled
                : styles.selected
              : disabled
              ? styles.uncheckedDisabled
              : styles.unchecked,
          ]}
        >
          {selected && !disabled ? <PrimaryGradientFill /> : null}
          {indeterminate ? (
            <View
              style={{
                width: recipe.controlSize * 0.5,
                height: recipe.indicatorStrokeWidth,
                borderRadius: radius.full,
                backgroundColor: indicatorColor,
              }}
            />
          ) : checked ? (
            <View
              style={{
                width: recipe.controlSize * 0.28,
                height: recipe.controlSize * 0.5,
                marginTop: -recipe.controlSize * 0.08,
                borderRightWidth: recipe.indicatorStrokeWidth,
                borderBottomWidth: recipe.indicatorStrokeWidth,
                borderColor: indicatorColor,
                transform: [{ rotate: '45deg' }],
              }}
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
  box: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unchecked: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.strong,
  },
  uncheckedDisabled: {
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
