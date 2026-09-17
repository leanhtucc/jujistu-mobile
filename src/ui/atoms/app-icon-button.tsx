import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { radius } from '@jujistu/shared/theme';

import { PrimaryGradientFill } from '../utils/primary-gradient-fill';
import { resolveAppButtonVisualRecipe } from './button-theme';
import { AppIcon } from './icon';
import type { IconButtonProps, IconButtonSize } from './icon-button.types';

const sizeRecipes: Record<
  IconButtonSize,
  { control: number; icon: number; hitSlop: number }
> = {
  sm: { control: 40, icon: 16, hitSlop: 4 },
  md: { control: 44, icon: 20, hitSlop: 2 },
  lg: { control: 56, icon: 24, hitSlop: 0 },
};

export function AppIconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = 'md',
  variant = 'primary',
  appearance = 'filled',
  disabled = false,
  loading = false,
  containerStyle,
}: IconButtonProps) {
  const unavailable = disabled || loading;
  const sizeRecipe = sizeRecipes[size];

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: unavailable }}
      disabled={unavailable}
      hitSlop={sizeRecipe.hitSlop}
      onPress={unavailable ? undefined : onPress}
      style={containerStyle}
    >
      {({ pressed }) => {
        const visualRecipe = resolveAppButtonVisualRecipe(
          variant,
          unavailable,
          appearance,
          pressed,
        );

        return (
          <View
            style={[
              styles.surface,
              {
                backgroundColor: visualRecipe.backgroundColor,
                borderColor: visualRecipe.borderColor,
                borderRadius: radius.xs,
                borderWidth: visualRecipe.borderWidth ?? 0,
                height: sizeRecipe.control,
                opacity: visualRecipe.opacity,
                width: sizeRecipe.control,
              },
            ]}
          >
            {visualRecipe.gradient ? <PrimaryGradientFill /> : null}
            {loading ? (
              <ActivityIndicator
                color={visualRecipe.foregroundColor}
                size="small"
              />
            ) : (
              <AppIcon
                accessible={false}
                color={visualRecipe.foregroundColor}
                name={icon}
                size={sizeRecipe.icon}
              />
            )}
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
