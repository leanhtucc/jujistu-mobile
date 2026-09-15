import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { componentTypography } from '@jujistu/shared/theme';

import { AppIcon } from './icon';
import {
  resolveAppButtonSizeRecipe,
  resolveAppButtonVisualRecipe,
} from './button-theme';
import type { ButtonProps } from './button.types';

const PRIMARY_GRADIENT_ID = 'button-primary-gradient';

function PrimaryGradient({ left, right }: { left: string; right: string }) {
  return (
    <Svg
      height="100%"
      pointerEvents="none"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
      viewBox="0 0 1 1"
      width="100%"
    >
      <Defs>
        <SvgLinearGradient id={PRIMARY_GRADIENT_ID} x1="0" x2="1" y1="0" y2="0">
          <Stop offset="0" stopColor={left} />
          <Stop offset="1" stopColor={right} />
        </SvgLinearGradient>
      </Defs>
      <Rect height="1" width="1" fill={`url(#${PRIMARY_GRADIENT_ID})`} />
    </Svg>
  );
}

export function AppButton({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'leading',
  disabled = false,
  onPress,
  accessibilityLabel,
  containerStyle,
}: ButtonProps) {
  const hasIcon = icon !== undefined;
  const sizeRecipe = resolveAppButtonSizeRecipe(size, hasIcon);
  const visualRecipe = resolveAppButtonVisualRecipe(variant, disabled);

  const renderedIcon = hasIcon ? (
    <AppIcon
      accessible={false}
      color={visualRecipe.foregroundColor}
      name={icon}
      size={sizeRecipe.iconSize}
    />
  ) : null;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={containerStyle}
    >
      <View
        style={[
          styles.surface,
          {
            backgroundColor: visualRecipe.backgroundColor,
            borderRadius: sizeRecipe.borderRadius,
            gap: sizeRecipe.gap,
            height: sizeRecipe.height,
            opacity: visualRecipe.opacity,
            paddingHorizontal: sizeRecipe.paddingHorizontal,
            paddingVertical: sizeRecipe.paddingVertical,
          },
        ]}
      >
        {visualRecipe.gradient ? (
          <PrimaryGradient
            left={visualRecipe.gradient.left}
            right={visualRecipe.gradient.right}
          />
        ) : null}
        {iconPosition === 'leading' ? renderedIcon : null}
        <Text
          style={[
            componentTypography.button,
            { color: visualRecipe.foregroundColor },
          ]}
        >
          {label}
        </Text>
        {iconPosition === 'trailing' ? renderedIcon : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
