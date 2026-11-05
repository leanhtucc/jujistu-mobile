import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { dsTypography, semanticColors } from '@jujistu/shared/theme';

import { AppIconButton } from '../atoms/app-icon-button';

export interface QuantityStepperProps {
  readonly value: number;
  readonly onDecrement: () => void;
  readonly onIncrement: () => void;
  readonly decrementLabel: string;
  readonly incrementLabel: string;
  readonly decrementDisabled?: boolean;
  readonly incrementDisabled?: boolean;
  readonly size?: 'sm' | 'md';
  readonly testID?: string;
}

export function AppQuantityStepper({
  value,
  onDecrement,
  onIncrement,
  decrementLabel,
  incrementLabel,
  decrementDisabled = false,
  incrementDisabled = false,
  size = 'md',
  testID = 'app-quantity-stepper',
}: QuantityStepperProps) {
  return (
    <View style={styles.root} testID={testID}>
      <AppIconButton
        shape="pill"
        accessibilityLabel={decrementLabel}
        appearance="soft"
        disabled={decrementDisabled}
        icon="minus"
        onPress={onDecrement}
        size={size}
        variant="secondaryDark"
      />
      <Text
        accessibilityLabel={`Số lượng ${value}`}
        accessibilityRole="adjustable"
        style={styles.value}
        testID={`${testID}-value`}
      >
        {value}
      </Text>
      <AppIconButton
        shape="pill"
        accessibilityLabel={incrementLabel}
        appearance="soft"
        disabled={incrementDisabled}
        icon="plus"
        onPress={onIncrement}
        size={size}
        variant="secondaryDark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  value: {
    ...dsTypography.stat,
    color: semanticColors.text.primary,
    fontSize: 18,
    lineHeight: 20,
    minWidth: 28,
    textAlign: 'center',
  },
});
