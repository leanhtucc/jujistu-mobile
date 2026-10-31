import React from 'react';
import {
  type DimensionValue,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

export type BeltRank = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export interface AppBeltBarProps {
  readonly belt?: BeltRank;
  readonly degrees?: number;
  readonly height?: number;
  readonly width?: DimensionValue;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

const BELT_COLORS: Record<BeltRank, string> = {
  white: '#EFEAE1',
  blue: '#2F5DA8',
  purple: '#6C3FA3',
  brown: '#6E4529',
  black: '#141414',
};

const BAR_COLORS: Record<BeltRank, string> = {
  white: '#0A0A0A',
  blue: '#0A0A0A',
  purple: '#0A0A0A',
  brown: '#0A0A0A',
  black: '#D42A1E',
};

export function AppBeltBar({
  belt = 'brown',
  degrees = 0,
  height = 12,
  width = '100%',
  style,
  testID = 'app-belt-bar',
}: AppBeltBarProps) {
  const safeDegrees = Math.min(4, Math.max(0, degrees));
  const sleeveWidth = Math.max(28, height * 2.4);

  return (
    <View
      accessibilityLabel={`Đai ${belt}, ${degrees} vạch`}
      accessible
      style={[
        styles.root,
        {
          height,
          width,
          borderRadius: Math.max(2, Math.round(height * 0.25)),
          backgroundColor: BELT_COLORS[belt] ?? BELT_COLORS.brown,
        },
        style,
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.sleeve,
          {
            width: sleeveWidth,
            backgroundColor: BAR_COLORS[belt] ?? BAR_COLORS.brown,
          },
        ]}
      >
        {Array.from({ length: safeDegrees }).map((_, index) => (
          <View key={index} style={styles.degreeStripe} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sleeve: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 3,
  },
  degreeStripe: {
    width: 2,
    height: '80%',
    backgroundColor: '#EFEAE1',
    borderRadius: 0.5,
  },
});
