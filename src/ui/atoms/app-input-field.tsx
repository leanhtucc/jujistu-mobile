import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { componentTypography, primitiveColors } from '@jujistu/shared/theme';

import { AppIcon } from './icon';
import {
  inputFieldFocusedGradient,
  resolveInputFieldSizeRecipe,
  resolveInputFieldVisualRecipe,
  resolveInputVisualState,
} from './input-field-theme';
import type { InputFieldProps } from './input-field.types';

const FOCUSED_BORDER_GRADIENT_ID = 'input-field-focused-border-gradient';

function FocusedBorderGradient() {
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
        <SvgLinearGradient
          gradientTransform={[...inputFieldFocusedGradient.transform]}
          gradientUnits="objectBoundingBox"
          id={FOCUSED_BORDER_GRADIENT_ID}
          x1="0"
          x2="1"
          y1="0"
          y2="0"
        >
          {inputFieldFocusedGradient.stops.map(stop => (
            <Stop
              key={stop.offset}
              offset={stop.offset}
              stopColor="#FFFFFF"
              stopOpacity={stop.opacity}
            />
          ))}
        </SvgLinearGradient>
      </Defs>
      <Rect fill={`url(#${FOCUSED_BORDER_GRADIENT_ID})`} height="1" width="1" />
    </Svg>
  );
}

export function AppInputField({
  value,
  onChangeText,
  placeholder,
  size = 'sm',
  status = 'neutral',
  error = false,
  disabled = false,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  autoComplete,
  accessibilityLabel,
  autoFocus = false,
  onBlur,
  containerStyle,
  leadingIcon,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const state = resolveInputVisualState({
    error: error || status === 'error',
    focused,
    disabled,
    value,
  });
  const sizeRecipe = resolveInputFieldSizeRecipe(size);
  const visualRecipe = resolveInputFieldVisualRecipe(state);

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.surface,
          {
            backgroundColor: visualRecipe.borderColor,
            borderRadius: sizeRecipe.borderRadius,
            gap: sizeRecipe.gap,
            height: sizeRecipe.height,
            opacity: visualRecipe.opacity,
          },
        ]}
      >
        {visualRecipe.usesFocusedGradient ? <FocusedBorderGradient /> : null}
        <View
          pointerEvents="none"
          style={[
            styles.innerSurface,
            {
              backgroundColor: visualRecipe.backgroundColor,
              borderRadius: sizeRecipe.borderRadius - sizeRecipe.borderWidth,
              bottom: sizeRecipe.borderWidth,
              left: sizeRecipe.borderWidth,
              right: sizeRecipe.borderWidth,
              top: sizeRecipe.borderWidth,
            },
          ]}
        />
        {leadingIcon ? (
          <AppIcon
            accessible={false}
            color={
              state === 'error'
                ? visualRecipe.textColor
                : primitiveColors.neutral[200]
            }
            name={leadingIcon}
            size={20}
            style={styles.leadingIcon}
          />
        ) : null}
        <TextInput
          accessibilityLabel={accessibilityLabel}
          accessibilityState={disabled ? { disabled: true } : undefined}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          editable={!disabled}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onChangeText={disabled ? undefined : onChangeText}
          onFocus={() => {
            if (!disabled) {
              setFocused(true);
            }
          }}
          placeholder={placeholder}
          placeholderTextColor={visualRecipe.placeholderColor}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            componentTypography.inputPlaceholder,
            {
              color: visualRecipe.textColor,
              paddingHorizontal: sizeRecipe.paddingHorizontal,
              paddingVertical: sizeRecipe.paddingVertical,
            },
            leadingIcon ? styles.inputWithLeadingIcon : null,
          ]}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  innerSurface: {
    position: 'absolute',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    textAlignVertical: 'center',
  },
  inputWithLeadingIcon: {
    paddingLeft: 0,
  },
  leadingIcon: {
    alignSelf: 'center',
    marginLeft: 16,
    position: 'relative',
    zIndex: 1,
  },
});
