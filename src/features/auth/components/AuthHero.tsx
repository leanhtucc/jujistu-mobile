import {
  selectResponsiveValue,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { JujitsuChampionshipTitle } from '@jujistu/ui';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const logo = require('../../../../assets/app/LogoApp.png');

type AuthHeroProps = {
  compact?: boolean;
};

export function AuthHero({ compact = false }: AuthHeroProps) {
  const responsive = useResponsive();
  const layout = selectResponsiveValue(responsive, {
    compactPhone: {
      descriptionFontSize: 15,
      descriptionLineHeight: 20,
      logoSize: compact ? 108 : 126,
      maxWidth: 300,
      titleHeight: 40,
    },
    phone: {
      descriptionFontSize: 16,
      descriptionLineHeight: 22,
      logoSize: compact ? 116 : 136,
      maxWidth: 340,
      titleHeight: 43,
    },
    largePhone: {
      descriptionFontSize: 18,
      descriptionLineHeight: 24,
      logoSize: compact ? 126 : 146,
      maxWidth: 400,
      titleHeight: 48,
    },
    tablet: {
      descriptionFontSize: 20,
      descriptionLineHeight: 28,
      logoSize: compact ? 150 : 170,
      maxWidth: 560,
      titleHeight: 56,
    },
    largeTablet: {
      descriptionFontSize: 22,
      descriptionLineHeight: 30,
      logoSize: compact ? 170 : 194,
      maxWidth: 680,
      titleHeight: 64,
    },
  });

  return (
    <View style={[styles.container, { maxWidth: layout.maxWidth }]}>
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel="Jujitsu Championship logo"
        source={logo}
        style={[
          styles.logo,
          {
            height: layout.logoSize,
            width: layout.logoSize,
          },
        ]}
      />
      <JujitsuChampionshipTitle height={layout.titleHeight} />
      <Text
        style={[
          styles.description,
          {
            fontSize: layout.descriptionFontSize,
            lineHeight: layout.descriptionLineHeight,
          },
        ]}
      >
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
    marginTop: 6,
    textAlign: 'center',
  },
  logo: {
    marginBottom: 12,
    resizeMode: 'contain',
  },
});
