import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';

export interface SegmentedOption {
  readonly key: string;
  readonly label: string;
}

export interface SegmentedControlProps {
  readonly options: ReadonlyArray<SegmentedOption>;
  readonly activeKey: string;
  readonly onChange: (key: string) => void;
  readonly testID?: string;
}

export function AppSegmentedControl({
  options,
  activeKey,
  onChange,
  testID = 'app-segmented-control',
}: SegmentedControlProps) {
  return (
    <View accessibilityRole="tablist" style={styles.root} testID={testID}>
      {options.map(option => {
        const selected = option.key === activeKey;
        return (
          <Pressable
            accessibilityLabel={option.label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[styles.segment, selected ? styles.segmentActive : null]}
            testID={`${testID}-${option.key}`}
          >
            <Text
              style={[
                styles.label,
                {
                  color: selected
                    ? semanticColors.text.primary
                    : semanticColors.text.tertiary,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semanticColors.background.surface,
    borderRadius: radius.full,
    flexDirection: 'row',
    padding: 4,
  },
  segment: {
    alignItems: 'center',
    borderRadius: radius.full,
    flex: 1,
    height: 36,
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: semanticColors.background.surfaceElevated },
  label: dsTypography.bodyStrong,
});
