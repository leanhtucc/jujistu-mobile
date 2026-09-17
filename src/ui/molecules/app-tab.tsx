import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { opacity as opacityTokens } from '@jujistu/shared/theme';

import { AppIcon } from '../atoms/icon';
import { resolveTabColors, tabFontFamily, tabSizeRecipes } from './tab-theme';
import type { TabProps } from './tab.types';

export function AppTab({
  label,
  onPress,
  selected = false,
  size = 'md',
  appearance = 'filled',
  variant = 'primary',
  leadingIcon,
  trailingIcon,
  disabled = false,
  accessibilityLabel,
  style,
  textStyle,
  testID,
}: TabProps) {
  const [isPressed, setIsPressed] = useState(false);
  const sizeRecipe = tabSizeRecipes[size];
  const colors = resolveTabColors({
    selected,
    disabled,
    appearance,
    variant,
  });

  const isInteractive = Boolean(onPress) && !disabled;
  const resolvedOpacity = disabled
    ? opacityTokens.disabled
    : isPressed
    ? 0.85
    : 1;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="tab"
      accessibilityState={{ disabled, selected }}
      disabled={!isInteractive}
      hitSlop={4}
      onPress={isInteractive ? onPress : undefined}
      onPressIn={() => {
        if (isInteractive) {
          setIsPressed(true);
        }
      }}
      onPressOut={() => {
        if (isInteractive) {
          setIsPressed(false);
        }
      }}
      style={[
        styles.container,
        {
          minHeight: sizeRecipe.minHeight,
          minWidth: sizeRecipe.minWidth,
          borderRadius: sizeRecipe.borderRadius,
          paddingHorizontal: sizeRecipe.paddingHorizontal,
          paddingVertical: sizeRecipe.paddingVertical,
          gap: sizeRecipe.gap,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          borderWidth: colors.borderWidth ?? 0,
          opacity: resolvedOpacity,
        },
        style,
      ]}
      testID={testID}
    >
      {leadingIcon ? (
        <View style={styles.iconSlot}>
          <AppIcon
            accessible={false}
            color={colors.contentColor}
            name={leadingIcon}
            size={sizeRecipe.iconSize}
          />
        </View>
      ) : null}

      <Text
        numberOfLines={1}
        style={[
          styles.labelText,
          {
            color: colors.contentColor,
            fontFamily: tabFontFamily,
            fontSize: sizeRecipe.fontSize,
            lineHeight: sizeRecipe.lineHeight,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>

      {trailingIcon ? (
        <View style={styles.iconSlot}>
          <AppIcon
            accessible={false}
            color={colors.contentColor}
            name={trailingIcon}
            size={sizeRecipe.iconSize}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  labelText: {
    fontWeight: '500',
    textAlign: 'center',
  },
});
