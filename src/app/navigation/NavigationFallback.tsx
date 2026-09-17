import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { useEffect, useRef } from 'react';
import {
  Animated,
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
  const progress = useRef(new Animated.Value(0.12)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          duration: 1200,
          toValue: 0.82,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          duration: 350,
          toValue: 0.12,
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [progress]);

  return (
    <ImageBackground
      accessibilityLabel="Loading application"
      accessibilityRole="progressbar"
      source={splashBackground}
      style={styles.container}
    >
      <View style={styles.hero}>
        <Image
          accessibilityIgnoresInvertColors
          source={logo}
          style={styles.logo}
        />
        <Text accessibilityRole="header" style={styles.title}>
          Welcome
        </Text>
        <Text style={styles.subtitle}>
          Chào mừng bạn đến với VIMMA{`\n`}Jujitsu Championship
        </Text>
      </View>

      <View style={[styles.loading, { bottom: insets.bottom + 24 }]}>
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
    gap: 4,
    width: 300,
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
    height: 156,
    marginBottom: 8,
    resizeMode: 'contain',
    width: 156,
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
    textAlign: 'center',
  },
  title: {
    color: semanticColors.text.primary,
    fontFamily: fontFamilies.display.regular,
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
