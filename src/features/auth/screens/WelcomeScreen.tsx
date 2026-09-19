import {
  getResponsiveContentWidth,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { AppButton } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHero } from '../components/AuthHero';

type WelcomeScreenProps = {
  onLogin: () => void;
};

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const responsive = useResponsive();
  const contentWidth = getResponsiveContentWidth(responsive);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, { width: contentWidth }]}>
        <AuthHero />
        <AppButton
          accessibilityLabel="Mở màn hình đăng nhập"
          containerStyle={styles.button}
          label="Đăng Nhập"
          labelStyle={styles.buttonLabel}
          onPress={onLogin}
          size="md"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 32,
    width: '100%',
  },
  buttonLabel: {
    fontSize: 18,
    lineHeight: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
