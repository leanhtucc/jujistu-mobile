import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const logo = require('../../../../assets/app/LogoApp.png');

type AuthHeroProps = {
  compact?: boolean;
};

export function AuthHero({ compact = false }: AuthHeroProps) {
  return (
    <View style={styles.container}>
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel="Jujitsu Championship logo"
        source={logo}
        style={[styles.logo, compact && styles.logoCompact]}
      />
      <Text accessibilityRole="header" style={styles.title}>
        Jujitsu Championship
      </Text>
      <Text style={styles.description}>
        Nơi quy tụ thông tin các trận đấu hot nhất VIMMA trong hệ thống giải đấu
        Jujitsu Championship
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  description: {
    color: semanticColors.text.secondary,
    fontFamily: fontFamilies.primary.medium,
    fontSize: 16,
    lineHeight: 20,
    marginTop: 4,
    maxWidth: 300,
    textAlign: 'center',
  },
  logo: {
    height: 146,
    resizeMode: 'contain',
    width: 146,
  },
  logoCompact: {
    height: 126,
    width: 126,
  },
  title: {
    color: semanticColors.text.primary,
    fontFamily: fontFamilies.display.regular,
    fontSize: 28,
    lineHeight: 35,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
