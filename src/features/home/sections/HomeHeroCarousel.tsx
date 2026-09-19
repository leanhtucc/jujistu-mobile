import {
  scaleResponsiveValue,
  type ResponsiveMetrics,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { primitiveColors, radius } from '@jujistu/shared/theme';
import React, { useCallback, useRef } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { HOME_BANNERS } from '../data/home-content';
import { useAutoCarousel } from '../hooks/useAutoCarousel';

const BANNER_GAP = 8;
const AUTO_PLAY_INTERVAL_MS = 4_000;
const FIGMA_ACTIVE_WIDTH = 281;
const FIGMA_ACTIVE_HEIGHT = 158.0625;
const FIGMA_INACTIVE_WIDTH = 222;
const FIGMA_INACTIVE_HEIGHT = 125;
const INITIAL_INDEX = 1;

export interface HomeHeroCarouselProps {
  readonly onInitialImageSettled?: () => void;
}

export function resolveHomeHeroGeometry(
  responsive: Pick<ResponsiveMetrics, 'shortestSide' | 'width'>,
) {
  const scale = scaleResponsiveValue(1, responsive, {
    minScale: 0.88,
    maxScale: 1.08,
    roundToPixel: false,
  });

  return {
    activeWidth: FIGMA_ACTIVE_WIDTH * scale,
    activeHeight: FIGMA_ACTIVE_HEIGHT * scale,
    inactiveWidth: FIGMA_INACTIVE_WIDTH * scale,
    inactiveHeight: FIGMA_INACTIVE_HEIGHT * scale,
  } as const;
}

export function HomeHeroCarousel({
  onInitialImageSettled,
}: HomeHeroCarouselProps) {
  const responsive = useResponsive();
  const { activeHeight, activeWidth, inactiveHeight, inactiveWidth } =
    resolveHomeHeroGeometry(responsive);
  const activeLeft = (responsive.width - activeWidth) / 2;
  const inactiveTop = (activeHeight - inactiveHeight) / 2;
  const initialImageSettledRef = useRef(false);
  const carousel = useAutoCarousel({
    initialIndex: INITIAL_INDEX,
    intervalMs: AUTO_PLAY_INTERVAL_MS,
    itemCount: HOME_BANNERS.length,
    itemStride: responsive.width,
  });
  const handleInitialImageSettled = useCallback(() => {
    if (initialImageSettledRef.current) {
      return;
    }

    initialImageSettledRef.current = true;
    onInitialImageSettled?.();
  }, [onInitialImageSettled]);

  return (
    <View
      accessibilityLabel="Banner sự kiện nổi bật"
      accessibilityValue={{
        min: 1,
        max: HOME_BANNERS.length,
        now: carousel.activeIndex + 1,
      }}
      accessible
      style={[styles.viewport, { height: activeHeight + 16 }]}
    >
      <ScrollView
        contentOffset={{ x: responsive.width * INITIAL_INDEX, y: 0 }}
        decelerationRate="fast"
        horizontal
        onMomentumScrollEnd={carousel.handleMomentumScrollEnd}
        onScrollBeginDrag={carousel.handleScrollBeginDrag}
        onScrollEndDrag={carousel.handleScrollEndDrag}
        ref={carousel.scrollRef}
        showsHorizontalScrollIndicator={false}
        snapToInterval={responsive.width}
        style={{ height: activeHeight }}
      >
        {HOME_BANNERS.map((source, index) => {
          const previousIndex =
            (index - 1 + HOME_BANNERS.length) % HOME_BANNERS.length;
          const nextIndex = (index + 1) % HOME_BANNERS.length;

          return (
            <View
              key={index}
              style={[
                styles.page,
                { width: responsive.width, height: activeHeight },
              ]}
            >
              <View
                style={[
                  styles.banner,
                  {
                    left: activeLeft - BANNER_GAP - inactiveWidth,
                    top: inactiveTop,
                    width: inactiveWidth,
                    height: inactiveHeight,
                  },
                ]}
              >
                <Image
                  source={HOME_BANNERS[previousIndex]}
                  resizeMode="cover"
                  style={styles.image}
                />
                <View
                  pointerEvents="none"
                  style={styles.inactiveOverlayStrong}
                />
              </View>

              <View
                style={[
                  styles.banner,
                  {
                    left: activeLeft,
                    width: activeWidth,
                    height: activeHeight,
                  },
                ]}
              >
                <Image
                  onError={
                    index === INITIAL_INDEX
                      ? handleInitialImageSettled
                      : undefined
                  }
                  onLoad={
                    index === INITIAL_INDEX
                      ? handleInitialImageSettled
                      : undefined
                  }
                  source={source}
                  resizeMode="cover"
                  style={styles.image}
                />
              </View>

              <View
                style={[
                  styles.banner,
                  {
                    left: activeLeft + activeWidth + BANNER_GAP,
                    top: inactiveTop,
                    width: inactiveWidth,
                    height: inactiveHeight,
                  },
                ]}
              >
                <Image
                  source={HOME_BANNERS[nextIndex]}
                  resizeMode="cover"
                  style={styles.image}
                />
                <View
                  pointerEvents="none"
                  style={styles.inactiveOverlayLight}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View accessibilityElementsHidden style={styles.pagination}>
        {HOME_BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === carousel.activeIndex ? styles.activeDot : undefined,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  page: {
    position: 'relative',
    overflow: 'hidden',
  },
  banner: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
  },
  inactiveOverlayStrong: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.sm,
    backgroundColor: primitiveColors.neutral[1000],
    opacity: 0.4,
  },
  inactiveOverlayLight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.sm,
    backgroundColor: primitiveColors.neutral[1000],
    opacity: 0.2,
  },
  pagination: {
    height: 4,
    marginTop: 12,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: primitiveColors.neutral[300],
  },
  activeDot: {
    backgroundColor: primitiveColors.red[500],
  },
});
