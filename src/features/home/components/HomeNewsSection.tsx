import { primitiveColors } from '@jujistu/shared/theme';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { HOME_NEWS, type HomeNewsItem } from '../data/home-content';

const FIGMA_SECTION_WIDTH = 360;
const FIGMA_IMAGE_WIDTH = 156;
const FIGMA_IMAGE_HEIGHT = 87;
const FIGMA_CONTENT_GAP = 19;

export function resolveHomeNewsGeometry(windowWidth: number) {
  const sectionWidth = Math.min(720, Math.max(0, windowWidth - 30));
  const scale = Math.min(1.6, sectionWidth / FIGMA_SECTION_WIDTH);

  return {
    contentGap: FIGMA_CONTENT_GAP * scale,
    imageHeight: FIGMA_IMAGE_HEIGHT * scale,
    imageWidth: FIGMA_IMAGE_WIDTH * scale,
    scale,
    sectionWidth,
  } as const;
}

export interface HomeNewsSectionProps {
  readonly news?: ReadonlyArray<HomeNewsItem>;
  readonly onPressAll?: () => void;
  readonly onPressItem?: (item: HomeNewsItem) => void;
}

export function HomeNewsSection({
  news = HOME_NEWS,
  onPressAll,
  onPressItem,
}: HomeNewsSectionProps) {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin tức</Text>
        {onPressAll ? (
          <Pressable
            accessibilityLabel="Xem tất cả tin tức"
            accessibilityRole="button"
            onPress={onPressAll}
          >
            <Text style={styles.viewAllText}>XEM TẤT CẢ</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Vertical News Items */}
      <View style={styles.itemsList}>
        {news.map((item, index) => {
          const isLast = index === news.length - 1;
          return (
            <Pressable
              accessibilityLabel={`${item.category ?? 'Tin tức'}: ${
                item.title ?? item.description
              }`}
              accessibilityRole="button"
              key={item.id}
              onPress={() => onPressItem?.(item)}
              style={({ pressed }) => [
                styles.itemRow,
                !isLast && styles.itemBorderBottom,
                pressed && styles.itemPressed,
              ]}
            >
              {/* Thumbnail */}
              <View style={styles.thumbnailContainer}>
                <Image
                  resizeMode="cover"
                  source={item.image}
                  style={styles.thumbnailImage}
                />
              </View>

              {/* Text metadata */}
              <View style={styles.infoCol}>
                {item.category ? (
                  <Text style={styles.categoryOverline}>{item.category}</Text>
                ) : null}
                <Text numberOfLines={2} style={styles.newsTitle}>
                  {item.title ?? item.description}
                </Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  viewAllText: {
    color: primitiveColors.orange[500],
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  itemsList: {
    gap: 0,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    borderStyle: 'dashed',
  },
  itemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  thumbnailContainer: {
    width: 92,
    height: 68,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 4,
    minWidth: 0,
  },
  categoryOverline: {
    color: primitiveColors.orange[500],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  newsTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  dateText: {
    color: primitiveColors.neutral[300],
    fontSize: 11,
    fontWeight: '500',
  },
});
