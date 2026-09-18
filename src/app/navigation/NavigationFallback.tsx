import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { AppGradientTitle } from '@jujistu/ui';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../../assets/app/LogoApp.png');
const splashBackground = require('../../../assets/image/backgrounds/bg_splash.png');

export function NavigationFallback() {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0.04)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      duration: 2400,
      easing: Easing.out(Easing.cubic),
      toValue: 0.96,
      useNativeDriver: false,
    });

    animation.start();
    return () => animation.stop();
  }, [progress]);

  return (
    <ImageBackground
      accessibilityIgnoresInvertColors
      accessibilityLabel="Loading application"
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, text: 'Loading' }}
      resizeMode="cover"
      source={splashBackground}
      style={styles.container}
    >
      <View style={styles.hero}>
        <Image
          accessibilityIgnoresInvertColors
          source={logo}
          style={styles.logo}
        />
        <AppGradientTitle
          accessibilityLabel="Welcome"
          fontSize={32}
          label="WELCOME"
          letterSpacing={0}
          lineHeight={40}
          shadow={false}
          strokeWidth={0}
        />
        <Text style={styles.subtitle}>
          Chào mừng bạn đến với VIMMA{`\n`}Jujitsu Championship
        </Text>
      </View>

      <View style={[styles.loading, { bottom: insets.bottom + 27 }]}>
        <Text style={styles.loadingLabel}>Loading...</Text>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.canvasDeep,
    flex: 1,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    maxWidth: 320,
    transform: [{ translateY: -26 }],
    width: '100%',
  },
  loading: {
    left: 16,
    position: 'absolute',
    right: 16,
  },
  loadingLabel: {
    color: semanticColors.text.secondary,
    fontFamily: fontFamilies.primary.regular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  logo: {
    height: 146,
    marginBottom: 16,
    resizeMode: 'contain',
    width: 146,
  },
  progressFill: {
    backgroundColor: semanticColors.text.primary,
    height: 5,
  },
  progressTrack: {
    borderColor: semanticColors.border.strong,
    borderWidth: 1,
    height: 13,
    padding: 3,
    width: '100%',
  },
  subtitle: {
    color: semanticColors.text.secondary,
    fontFamily: fontFamilies.primary.medium,
    fontSize: 16,
    lineHeight: 20,
    maxWidth: 300,
    textAlign: 'center',
  },
});
