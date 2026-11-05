import type { ResponsiveMetrics } from '@jujistu/shared/constants/responsive';
import { primitiveColors } from '@jujistu/shared/theme';
import { AppPressable, AppScrim } from '@jujistu/ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { HOME_HERO_SLIDES, type HomeHeroSlide } from '../data/home-content';

const FIGMA_ACTIVE_WIDTH = 281;
const FIGMA_ACTIVE_HEIGHT = 158.0625;
const FIGMA_INACTIVE_WIDTH = 222;
const FIGMA_INACTIVE_HEIGHT = 125;
const SLIDE_DURATION = 4500;

export function resolveHomeHeroGeometry(
  responsive: Pick<ResponsiveMetrics, 'shortestSide' | 'width'> &
    Partial<
      Pick<ResponsiveMetrics, 'isTablet' | 'isLargeTablet' | 'sizeClass'>
    >,
) {
  const isTablet =
    Boolean(responsive.isTablet) ||
    Boolean(responsive.isLargeTablet) ||
    responsive.sizeClass === 'tablet' ||
    responsive.sizeClass === 'largeTablet' ||
    responsive.shortestSide >= 600;

  if (isTablet) {
    const activeWidth = Math.min(640, responsive.width * 0.72);
    const activeHeight = activeWidth * (9 / 16);
    const inactiveWidth = activeWidth * 0.79;
    const inactiveHeight = inactiveWidth * (9 / 16);

    return {
      activeHeight: Math.round(activeHeight),
      activeWidth: Math.round(activeWidth),
      inactiveHeight: Math.round(inactiveHeight),
      inactiveWidth: Math.round(inactiveWidth),
    } as const;
  }

  const activeWidth = Math.min(
    responsive.width - 32,
    Math.max(250, responsive.width * 0.78),
  );
  const activeHeight = activeWidth * (FIGMA_ACTIVE_HEIGHT / FIGMA_ACTIVE_WIDTH);
  const inactiveWidth =
    activeWidth * (FIGMA_INACTIVE_WIDTH / FIGMA_ACTIVE_WIDTH);
  const inactiveHeight =
    inactiveWidth * (FIGMA_INACTIVE_HEIGHT / FIGMA_INACTIVE_WIDTH);

  return {
    activeHeight,
    activeWidth,
    inactiveHeight,
    inactiveWidth,
  } as const;
}

export interface HomeHeroCarouselProps {
  readonly onInitialImageSettled?: () => void;
  readonly onPressSlide?: (slide: HomeHeroSlide) => void;
}

export function HomeHeroCarousel({
  onInitialImageSettled,
  onPressSlide,
}: HomeHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width - 32,
  );
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView> | null>(
    null,
  );
  const progressAnim = useRef(new Animated.Value(0)).current;

  const startProgressAnimation = useCallback(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      duration: SLIDE_DURATION,
      easing: Easing.linear,
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / containerWidth);
      if (
        index >= 0 &&
        index < HOME_HERO_SLIDES.length &&
        index !== activeIndex
      ) {
        setActiveIndex(index);
        startProgressAnimation();
      }
    },
    [activeIndex, containerWidth, startProgressAnimation],
  );

  useEffect(() => {
    startProgressAnimation();

    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % HOME_HERO_SLIDES.length;
        scrollViewRef.current?.scrollTo({
          animated: true,
          x: next * containerWidth,
        });
        return next;
      });
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        duration: SLIDE_DURATION,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: false,
      }).start();
    }, SLIDE_DURATION);

    return () => {
      clearInterval(timer);
      progressAnim.stopAnimation();
    };
  }, [containerWidth, progressAnim, startProgressAnimation]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const initialSettledRef = useRef(false);
  const handleImageSettled = useCallback(() => {
    if (!initialSettledRef.current) {
      initialSettledRef.current = true;
      onInitialImageSettled?.();
    }
  }, [onInitialImageSettled]);

  return (
    <View
      accessibilityLabel="Banner sự kiện nổi bật"
      accessibilityValue={{
        max: HOME_HERO_SLIDES.length,
        min: 1,
        now: activeIndex + 1,
      }}
      onLayout={e => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
      style={styles.root}
    >
      <ScrollView
        contentContainerStyle={{
          width: containerWidth * HOME_HERO_SLIDES.length,
        }}
        horizontal
        nestedScrollEnabled
        onMomentumScrollEnd={handleScroll}
        pagingEnabled
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[styles.scroll, { width: containerWidth }]}
      >
        {HOME_HERO_SLIDES.map(slide => {
          return (
            <AppPressable
              key={slide.id}
              onPress={() => onPressSlide?.(slide)}
              style={({ pressed }) => [
                styles.card,
                { width: containerWidth },
                pressed && styles.cardPressed,
              ]}
            >
              <Image
                fadeDuration={0}
                onLoad={handleImageSettled}
                resizeMode="cover"
                source={slide.image}
                style={[StyleSheet.absoluteFill, styles.cardImage]}
              />
              {/* Subtle top & bottom dark scrim gradients */}
              <AppScrim edge="top" height={64} strength={0.5} />
              <AppScrim edge="bottom" height="72%" />

              {/* Slide text and tag details at bottom */}
              <View style={styles.textContainer}>
                <View
                  style={[
                    styles.tagPill,
                    slide.tagVariant === 'accent'
                      ? styles.tagAccent
                      : slide.tagVariant === 'solid'
                      ? styles.tagSolid
                      : styles.tagNeutral,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      slide.tagVariant === 'accent' && styles.tagAccentText,
                    ]}
                  >
                    {slide.tag}
                  </Text>
                </View>

                <Text numberOfLines={2} style={styles.titleText}>
                  {slide.title}
                </Text>
                <Text numberOfLines={1} style={styles.metaText}>
                  {slide.meta}
                </Text>
              </View>
            </AppPressable>
          );
        })}
      </ScrollView>

      {/* Progress segment indicators at TOP */}
      <View style={styles.indicatorsContainer}>
        {HOME_HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          return (
            <View key={`indicator-${slide.id}`} style={styles.indicatorTrack}>
              {isActive ? (
                <Animated.View
                  style={[styles.indicatorBar, { width: progressWidth }]}
                />
              ) : (
                <View
                  style={[
                    styles.indicatorBar,
                    isPast
                      ? styles.indicatorBarFilled
                      : styles.indicatorBarEmpty,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    backgroundColor: primitiveColors.neutral[900],
    height: 220,
  },
  scroll: {
    height: 220,
  },
  card: {
    height: 220,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: primitiveColors.neutral[850],
  },
  cardPressed: {
    opacity: 0.95,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    gap: 8,
  },
  tagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagAccent: {
    backgroundColor: 'rgba(254, 139, 51, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(254, 139, 51, 0.5)',
  },
  tagAccentText: {
    color: primitiveColors.orange[500],
  },
  tagSolid: {
    backgroundColor: primitiveColors.red[500],
  },
  tagNeutral: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  tagText: {
    color: primitiveColors.neutral[0],
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  titleText: {
    color: primitiveColors.neutral[0],
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  metaText: {
    color: primitiveColors.neutral[200],
    fontSize: 12,
    fontWeight: '500',
  },
  indicatorsContainer: {
    position: 'absolute',
    top: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 4,
  },
  indicatorTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    overflow: 'hidden',
  },
  indicatorBar: {
    height: 3,
    borderRadius: 2,
    backgroundColor: primitiveColors.neutral[0],
  },
  indicatorBarFilled: {
    width: '100%',
  },
  indicatorBarEmpty: {
    width: '0%',
  },
});
