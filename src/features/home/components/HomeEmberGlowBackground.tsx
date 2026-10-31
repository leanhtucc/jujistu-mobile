import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export function HomeEmberGlowBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient
            id="emberGlow"
            cx="100%"
            cy="0%"
            rx="90%"
            ry="65%"
            fx="100%"
            fy="0%"
          >
            <Stop offset="0%" stopColor="#FF8A2E" stopOpacity="0.32" />
            <Stop offset="35%" stopColor="#D42A1E" stopOpacity="0.22" />
            <Stop offset="65%" stopColor="#6B0A12" stopOpacity="0.14" />
            <Stop offset="100%" stopColor="#0B0A0A" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#emberGlow)" />
      </Svg>
    </View>
  );
}
