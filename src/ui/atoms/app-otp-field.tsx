import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  resolveOtpCellVisualRecipe,
  resolveOtpFieldSizeRecipe,
} from './otp-field-theme';
import type { OtpFieldProps } from './otp-field.types';

const DEFAULT_DIGIT_COUNT = 6;

function normalizeOtp(value: string, digitCount: number) {
  return value.replace(/\D/g, '').slice(0, digitCount);
}

export function AppOtpField({
  value,
  onChangeText,
  digitCount = DEFAULT_DIGIT_COUNT,
  size = 'sm',
  status = 'neutral',
  disabled = false,
  accessibilityLabel = 'One-time passcode',
  containerStyle,
}: OtpFieldProps) {
  const [focused, setFocused] = useState(false);
  const safeDigitCount = Number.isFinite(digitCount)
    ? Math.max(1, Math.floor(digitCount))
    : DEFAULT_DIGIT_COUNT;
  const normalizedValue = normalizeOtp(value, safeDigitCount);
  const digits = useMemo(
    () =>
      Array.from(
        { length: safeDigitCount },
        (_, index) => normalizedValue[index] ?? '',
      ),
    [normalizedValue, safeDigitCount],
  );
  const sizeRecipe = resolveOtpFieldSizeRecipe(size);
  const activeIndex = Math.min(normalizedValue.length, safeDigitCount - 1);

  return (
    <View style={[styles.container, { gap: sizeRecipe.gap }, containerStyle]}>
      {digits.map((digit, index) => {
        const visualRecipe = resolveOtpCellVisualRecipe({
          status,
          disabled,
          filled: digit.length > 0,
          focused: focused && index === activeIndex,
        });

        return (
          <View
            accessible={false}
            key={index}
            style={[
              styles.cell,
              {
                backgroundColor: visualRecipe.backgroundColor,
                borderColor: visualRecipe.borderColor,
                borderRadius: sizeRecipe.borderRadius,
                borderWidth: visualRecipe.borderWidth,
                height: sizeRecipe.height,
                opacity: visualRecipe.opacity,
                width: sizeRecipe.width,
              },
            ]}
          >
            <Text
              style={[sizeRecipe.textStyle, { color: visualRecipe.textColor }]}
            >
              {digit}
            </Text>
          </View>
        );
      })}
      <TextInput
        accessibilityLabel={accessibilityLabel}
        accessibilityState={disabled ? { disabled: true } : undefined}
        autoComplete="sms-otp"
        caretHidden
        editable={!disabled}
        keyboardType="number-pad"
        onBlur={() => setFocused(false)}
        onChangeText={
          disabled
            ? undefined
            : nextValue => onChangeText(normalizeOtp(nextValue, safeDigitCount))
        }
        onFocus={() => {
          if (!disabled) {
            setFocused(true);
          }
        }}
        style={styles.input}
        textContentType="oneTimeCode"
        value={normalizedValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    position: 'relative',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    bottom: 0,
    backgroundColor: 'transparent',
    color: 'transparent',
    left: 0,
    opacity: 0.01,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
