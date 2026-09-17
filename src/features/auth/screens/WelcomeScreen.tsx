import { AppButton } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthBackground } from '../components/AuthBackground';
import { AuthHero } from '../components/AuthHero';

type WelcomeScreenProps = {
  onLogin: () => void;
};

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  return (
    <AuthBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <AuthHero />
          <AppButton
            accessibilityLabel="Mở màn hình đăng nhập"
            containerStyle={styles.button}
            label="Đăng Nhập"
            onPress={onLogin}
            size="lg"
          />
        </View>
      </SafeAreaView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 32,
    width: '100%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  safeArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
