import React, { type PropsWithChildren } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const background = require('../../../../assets/image/backgrounds/bg_login.png');

type AuthBackgroundProps = PropsWithChildren<{
  dimmed?: boolean;
}>;

export function AuthBackground({
  children,
  dimmed = false,
}: AuthBackgroundProps) {
  return (
    <ImageBackground
      accessibilityIgnoresInvertColors
      accessible={false}
      resizeMode="cover"
      source={background}
      style={styles.background}
    >
      {dimmed ? <View pointerEvents="none" style={styles.dim} /> : null}
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000000',
    flex: 1,
  },
  dim: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
