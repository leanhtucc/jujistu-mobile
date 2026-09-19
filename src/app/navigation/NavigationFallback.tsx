import { createLogger } from '@jujistu/shared/logger/logger';
import {
  getResponsiveContentWidth,
  selectResponsiveValue,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
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
  const responsive = useResponsive();
  const contentWidth = getResponsiveContentWidth(responsive);
  const layout = selectResponsiveValue(responsive, {
    compactPhone: {
      heroWidth: 290,
      loadingFontSize: 14,
      loadingLineHeight: 20,
      logoSize: 126,
      subtitleFontSize: 15,
      subtitleLineHeight: 20,
      titleFontSize: 30,
      titleLineHeight: 38,
    },
    phone: {
      heroWidth: 320,
      loadingFontSize: 14,
      loadingLineHeight: 20,
      logoSize: 136,
      subtitleFontSize: 16,
      subtitleLineHeight: 22,
      titleFontSize: 32,
      titleLineHeight: 40,
    },
    largePhone: {
      heroWidth: 400,
      loadingFontSize: 16,
      loadingLineHeight: 22,
      logoSize: 146,
      subtitleFontSize: 18,
      subtitleLineHeight: 24,
      titleFontSize: 36,
      titleLineHeight: 45,
    },
    tablet: {
      heroWidth: 560,
      loadingFontSize: 18,
      loadingLineHeight: 24,
      logoSize: 176,
      subtitleFontSize: 20,
      subtitleLineHeight: 28,
      titleFontSize: 42,
      titleLineHeight: 52,
    },
    largeTablet: {
      heroWidth: 680,
      loadingFontSize: 20,
      loadingLineHeight: 28,
      logoSize: 208,
      subtitleFontSize: 22,
      subtitleLineHeight: 30,
      titleFontSize: 48,
      titleLineHeight: 60,
    },
  });
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
          <View style={[styles.hero, { maxWidth: layout.heroWidth }]}>
            <Image
              accessibilityIgnoresInvertColors
              fadeDuration={0}
              onError={handleLogoError}
              onLoad={() => setLogoSettled(true)}
              source={logo}
              style={[
                styles.logo,
                { height: layout.logoSize, width: layout.logoSize },
              ]}
            />
            <AppGradientTitle
              accessibilityLabel="Welcome"
              fontSize={layout.titleFontSize}
              label="WELCOME"
              letterSpacing={0}
              lineHeight={layout.titleLineHeight}
              shadow={false}
              strokeWidth={0}
            />
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: layout.subtitleFontSize,
                  lineHeight: layout.subtitleLineHeight,
                },
              ]}
            >
              Chào mừng bạn đến với VIMMA{`\n`}Jujitsu Championship
            </Text>
          </View>

          <View
            style={[
              styles.loading,
              { bottom: insets.bottom + 27, width: contentWidth },
            ]}
          >
            <Text
              style={[
                styles.loadingLabel,
                {
                  fontSize: layout.loadingFontSize,
                  lineHeight: layout.loadingLineHeight,
                },
              ]}
            >
              Loading...
            </Text>
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
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
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
    transform: [{ translateY: -26 }],
    width: '100%',
  },
  loading: {
    alignSelf: 'center',
    position: 'absolute',
  },
  loadingLabel: {
    color: semanticColors.text.secondary,
    fontFamily: fontFamilies.primary.regular,
    marginBottom: 4,
    textAlign: 'center',
  },
  logo: {
    marginBottom: 16,
    resizeMode: 'contain',
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
    textAlign: 'center',
  },
});
