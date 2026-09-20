import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useResponsive } from '@jujistu/shared/constants/responsive';
import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { AppButton } from '@jujistu/ui';

const logo = require('../../../../assets/app/LogoApp.png');

export interface GuestAccountHeaderProps {
  readonly onLogin?: () => void;
}

export function GuestAccountHeader({ onLogin }: GuestAccountHeaderProps) {
  const responsive = useResponsive();
  const isTablet = responsive.isTablet;

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel="Jujitsu Championship Logo"
          resizeMode="contain"
          source={logo}
          style={styles.logo}
        />
        <View style={styles.textGroup}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.title, isTablet ? styles.tabletTitle : undefined]}
          >
            Chào mừng đến với VIMMA!
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              styles.description,
              isTablet ? styles.tabletDescription : undefined,
            ]}
          >
            Đăng nhập ngay để nhận thông tin mới nhất về giải đấu!
          </Text>
        </View>
      </View>

      <AppButton
        accessibilityLabel="Đăng nhập"
        containerStyle={styles.loginButton}
        label="Đăng nhập"
        labelStyle={styles.loginButtonLabel}
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
    height: 64,
    paddingHorizontal: 16,
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
    width: 48,
    height: 48,
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
    width: 90,
    height: 30,
    flexShrink: 0,
  },
  loginButtonLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tabletTitle: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.2,
  },
  tabletDescription: {
    fontSize: 14.5,
    lineHeight: 19,
    marginTop: 3,
  },
});
