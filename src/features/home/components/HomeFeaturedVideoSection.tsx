import { primitiveColors } from '@jujistu/shared/theme';
import { AppIcon, AppPressable } from '@jujistu/ui';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HOME_FEATURED_VIDEOS, type HomeVideoItem } from '../data/home-content';

const FIGMA_SECTION_WIDTH = 364;
const VIDEO_WIDTH = 166;
const VIDEO_HEIGHT = 92;
const VIDEO_GAP = 19;

export function resolveHomeFeaturedVideoGeometry(windowWidth: number) {
  const sectionWidth = Math.min(720, Math.max(0, windowWidth - 26));
  const scale = Math.min(1.5, sectionWidth / FIGMA_SECTION_WIDTH);
  const cardGap = Math.min(28, Math.max(12, VIDEO_GAP * scale));
  const cardWidth = (sectionWidth - cardGap) / 2;

  return {
    cardGap,
    cardHeight: cardWidth * (VIDEO_HEIGHT / VIDEO_WIDTH),
    cardWidth,
    scale,
    sectionWidth,
  } as const;
}

export interface HomeFeaturedVideoSectionProps {
  readonly items?: ReadonlyArray<HomeVideoItem>;
  readonly onPressAll?: () => void;
  readonly onPressItem?: (item: HomeVideoItem) => void;
}

export function HomeFeaturedVideoSection({
  items = HOME_FEATURED_VIDEOS,
  onPressAll,
  onPressItem,
}: HomeFeaturedVideoSectionProps) {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phát lại & highlight</Text>
        <AppPressable
          accessibilityLabel="Xem tất cả trên YouTube"
          accessibilityRole="button"
          onPress={onPressAll}
          style={styles.youtubeBadge}
        >
          <AppIcon color={primitiveColors.red[500]} name="play" size={12} />
          <Text style={styles.youtubeText}>YOUTUBE</Text>
        </AppPressable>
      </View>

      {/* Video Horizontal List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {items.map(item => (
          <AppPressable
            accessibilityLabel={item.title}
            accessibilityRole="button"
            key={item.id}
            onPress={() => onPressItem?.(item)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            {/* Thumbnail */}
            <View style={styles.thumbnailContainer}>
              <Image
                resizeMode="cover"
                source={item.image}
                style={styles.thumbnailImage}
              />
              <View style={styles.darkScrim} />

              {/* Centered Glass Play button */}
              <View style={styles.playButtonCircle}>
                <AppIcon
                  color={primitiveColors.neutral[0]}
                  name="play"
                  size={18}
                />
              </View>

              {/* Duration badge at bottom right */}
              {item.duration && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
              )}
            </View>

            {/* Video metadata */}
            <View style={styles.infoCol}>
              <Text numberOfLines={2} style={styles.videoTitle}>
                {item.title}
              </Text>
              {item.meta && (
                <Text numberOfLines={1} style={styles.videoMeta}>
                  {item.meta}
                </Text>
              )}
            </View>
          </AppPressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  youtubeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  youtubeText: {
    color: primitiveColors.neutral[300],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    width: 224,
    gap: 8,
  },
  cardPressed: {
    opacity: 0.85,
  },
  thumbnailContainer: {
    height: 126,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  darkScrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(11, 10, 10, 0.35)',
  },
  playButtonCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  durationText: {
    color: primitiveColors.neutral[0],
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  infoCol: {
    gap: 4,
  },
  videoTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  videoMeta: {
    color: primitiveColors.neutral[300],
    fontSize: 11,
    fontWeight: '500',
  },
});
