import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { componentTypography } from '@jujistu/shared/theme';

import { AppIcon } from './icon';
import { PrimaryGradientFill } from '../utils/primary-gradient-fill';
import {
  resolveAppButtonSizeRecipe,
  resolveAppButtonVisualRecipe,
} from './button-theme';
import type { ButtonProps } from './button.types';

export function AppButton({
  label,
  variant = 'primary',
  appearance = 'filled',
  size = 'md',
  icon,
  iconPosition = 'leading',
  disabled = false,
  loading = false,
  onPress,
  accessibilityLabel,
  containerStyle,
  labelStyle,
}: ButtonProps) {
  const hasIcon = icon !== undefined;
  const sizeRecipe = resolveAppButtonSizeRecipe(size, hasIcon);
  const unavailable = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={
        loading ? { busy: true, disabled: true } : { disabled }
      }
      disabled={unavailable}
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
        const renderedIcon = hasIcon ? (
          <AppIcon
            accessible={false}
            color={visualRecipe.foregroundColor}
            name={icon}
            size={sizeRecipe.iconSize}
          />
        ) : null;

        return (
          <View
            style={[
              styles.surface,
              {
                backgroundColor: visualRecipe.backgroundColor,
                borderColor: visualRecipe.borderColor,
                borderRadius: sizeRecipe.borderRadius,
                borderWidth: visualRecipe.borderWidth ?? 0,
                height: sizeRecipe.height,
                opacity: visualRecipe.opacity,
              },
            ]}
          >
            {visualRecipe.gradient ? <PrimaryGradientFill /> : null}
            <View
              style={[
                styles.content,
                {
                  gap: sizeRecipe.gap,
                  paddingHorizontal: sizeRecipe.paddingHorizontal,
                  paddingVertical: sizeRecipe.paddingVertical,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator
                  color={visualRecipe.foregroundColor}
                  size="small"
                />
              ) : iconPosition === 'leading' ? (
                renderedIcon
              ) : null}
              <Text
                style={[
                  componentTypography.button,
                  styles.label,
                  { color: visualRecipe.foregroundColor },
                  labelStyle,
                ]}
              >
                {label}
              </Text>
              {!loading && iconPosition === 'trailing' ? renderedIcon : null}
            </View>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  label: {
    includeFontPadding: true,
  },
  surface: {
    overflow: 'hidden',
    position: 'relative',
  },
});
