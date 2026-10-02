import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  selectResponsiveValue,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { AppButton } from '@jujistu/ui';

const logo = require('../../../../assets/app/LogoApp.png');

export interface GuestAccountHeaderProps {
  readonly onLogin?: () => void;
}

export function GuestAccountHeader({ onLogin }: GuestAccountHeaderProps) {
  const responsive = useResponsive();
  const layout = selectResponsiveValue(responsive, {
    compactPhone: {
      buttonHeight: 30,
      buttonWidth: 90,
      descriptionLineHeight: 15,
      descriptionSize: 11,
      height: 64,
      horizontalPadding: 16,
      logoSize: 48,
      titleLineHeight: 18,
      titleSize: 14,
    },
    largePhone: {
      buttonHeight: 38,
      buttonWidth: 108,
      descriptionLineHeight: 17,
      descriptionSize: 13,
      height: 76,
      horizontalPadding: 20,
      logoSize: 58,
      titleLineHeight: 22,
      titleSize: 17,
    },
    tablet: {
      buttonHeight: 42,
      buttonWidth: 124,
      descriptionLineHeight: 19,
      descriptionSize: 14.5,
      height: 88,
      horizontalPadding: 24,
      logoSize: 68,
      titleLineHeight: 25,
      titleSize: 20,
    },
    largeTablet: {
      buttonHeight: 46,
      buttonWidth: 140,
      descriptionLineHeight: 21,
      descriptionSize: 16,
      height: 96,
      horizontalPadding: 32,
      logoSize: 76,
      titleLineHeight: 28,
      titleSize: 22,
    },
  });

  return (
    <View
      style={[
        styles.container,
        {
          height: layout.height,
          paddingHorizontal: layout.horizontalPadding,
        },
      ]}
    >
      <View style={styles.leftGroup}>
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel="Jujitsu Championship Logo"
          resizeMode="contain"
          source={logo}
          style={[
            styles.logo,
            { height: layout.logoSize, width: layout.logoSize },
          ]}
        />
        <View style={styles.textGroup}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.title,
              {
                fontSize: layout.titleSize,
                lineHeight: layout.titleLineHeight,
              },
            ]}
          >
            Chào mừng đến với VIMMA!
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              styles.description,
              {
                fontSize: layout.descriptionSize,
                lineHeight: layout.descriptionLineHeight,
              },
            ]}
          >
            Đăng nhập ngay để nhận thông tin mới nhất về giải đấu!
          </Text>
        </View>
      </View>

      <AppButton
        accessibilityLabel="Đăng nhập"
        containerStyle={[
          styles.loginButton,
          { height: layout.buttonHeight, width: layout.buttonWidth },
        ]}
        label="Đăng nhập"
        labelStyle={[
          styles.loginButtonLabel,
          {
            fontSize: Math.max(12, layout.descriptionSize),
            lineHeight: Math.max(16, layout.descriptionSize * 1.25),
          },
        ]}
        onPress={onLogin ?? (() => undefined)}
        size="sm"
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#030003',
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    minWidth: 0,
  },
  logo: {
    marginRight: 6,
    flexShrink: 0,
  },
  textGroup: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  title: {
    color: semanticColors.text.primary,
    fontFamily: fontFamilies.primary.bold,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: -0.14,
  },
  description: {
    color: semanticColors.text.secondary,
    fontFamily: fontFamilies.primary.regular,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  loginButton: {
    alignItems: 'stretch',
    flexShrink: 0,
    justifyContent: 'center',
  },
  loginButtonLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
