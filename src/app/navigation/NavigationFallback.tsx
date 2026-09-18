import { createLogger } from '@jujistu/shared/logger/logger';
import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { AppGradientTitle } from '@jujistu/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../../assets/app/LogoApp.png');
const splashBackground = require('../../../assets/image/backgrounds/bg_splash.png');
const log = createLogger('NavigationFallback');

export interface NavigationFallbackProps {
  readonly onReady?: () => void;
  readonly duration?: number;
}

export function NavigationFallback({
  onReady,
  duration = 4000,
}: NavigationFallbackProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const [backgroundSettled, setBackgroundSettled] = useState(false);
  const [logoSettled, setLogoSettled] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const sceneReady = backgroundSettled && logoSettled && hasLayout;

  useEffect(() => {
    if (!sceneReady) {
      return;
    }

    const animation = Animated.timing(progress, {
      duration,
      easing: Easing.linear,
      toValue: 1,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [duration, progress, sceneReady]);

  useEffect(() => {
    if (sceneReady) {
      onReady?.();
    }
  }, [onReady, sceneReady]);

  const handleBackgroundError = useCallback(() => {
    log.error('Loading background failed to load');
    setBackgroundSettled(true);
  }, []);

  const handleLogoError = useCallback(() => {
    log.error('Loading logo failed to load');
    setLogoSettled(true);
  }, []);

  return (
    <View
      accessibilityIgnoresInvertColors
      accessibilityLabel="Loading application"
      accessibilityRole="progressbar"
      accessibilityValue={{ text: 'Loading' }}
      onLayout={() => setHasLayout(true)}
      style={styles.container}
    >
      <View style={[styles.scene, !sceneReady && styles.scenePending]}>
        <Image
          accessibilityIgnoresInvertColors
          fadeDuration={0}
          onError={handleBackgroundError}
          onLoad={() => setBackgroundSettled(true)}
          resizeMode="cover"
          source={splashBackground}
          style={styles.background}
        />

        <View style={styles.foreground}>
          <View style={styles.hero}>
            <Image
              accessibilityIgnoresInvertColors
              fadeDuration={0}
              onError={handleLogoError}
              onLoad={() => setLogoSettled(true)}
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
            <View
              onLayout={event => setTrackWidth(event.nativeEvent.layout.width)}
              style={styles.progressTrack}
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    transform: [
                      {
                        translateX: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-Math.max(trackWidth, 1), 0],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  foreground: {
    alignItems: 'center',
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
    width: '100%',
  },
  progressTrack: {
    borderColor: semanticColors.border.strong,
    borderWidth: 1,
    height: 13,
    overflow: 'hidden',
    paddingVertical: 3,
    width: '100%',
  },
  scene: {
    flex: 1,
  },
  scenePending: {
    opacity: 0,
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
