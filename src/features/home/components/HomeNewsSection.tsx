import {
  type ResponsiveMetrics,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import {
  primitiveColors,
  radius,
  semanticColors,
  typography,
} from '@jujistu/shared/theme';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { HOME_NEWS, type HomeNewsItem } from '../data/home-content';

const NEWS_GAP = 10;
const FIGMA_NEWS_IMAGE_ASPECT_RATIO = 174 / 97;
const NEWS_TITLE_HEIGHT = 40;
const SECTION_HORIZONTAL_PADDING = 16;
const MAX_SECTION_WIDTH = 520;
const TABLET_MAX_SECTION_WIDTH = 720;

export function resolveHomeNewsCardWidth(
  screenWidthOrResponsive:
    | number
    | (Pick<ResponsiveMetrics, 'width'> &
        Partial<
          Pick<
            ResponsiveMetrics,
            'isTablet' | 'isLargeTablet' | 'sizeClass' | 'shortestSide'
          >
        >),
  isTabletOverride?: boolean,
): number {
  if (typeof screenWidthOrResponsive === 'object') {
    const responsive = screenWidthOrResponsive;
    const isTablet =
      isTabletOverride !== undefined
        ? isTabletOverride
        : Boolean(responsive.isTablet) ||
          Boolean(responsive.isLargeTablet) ||
          responsive.sizeClass === 'tablet' ||
          responsive.sizeClass === 'largeTablet' ||
          (responsive.shortestSide !== undefined &&
            responsive.shortestSide >= 600);
    const maxSectionWidth = isTablet
      ? TABLET_MAX_SECTION_WIDTH
      : MAX_SECTION_WIDTH;
    const sectionWidth = Math.min(responsive.width, maxSectionWidth);

    return (sectionWidth - SECTION_HORIZONTAL_PADDING * 2 - NEWS_GAP) / 2;
  }

  const screenWidth = screenWidthOrResponsive;
  const maxSectionWidth = isTabletOverride
    ? TABLET_MAX_SECTION_WIDTH
    : MAX_SECTION_WIDTH;
  const sectionWidth = Math.min(screenWidth, maxSectionWidth);

  return (sectionWidth - SECTION_HORIZONTAL_PADDING * 2 - NEWS_GAP) / 2;
}

export interface HomeNewsSectionProps {
  readonly onPressAll?: () => void;
  readonly onPressItem?: (item: HomeNewsItem) => void;
}

function NewsCard({
  imageHeight,
  isTablet = false,
  item,
  onPress,
  width,
}: {
  readonly item: HomeNewsItem;
  readonly width: number;
  readonly imageHeight: number;
  readonly isTablet?: boolean;
  readonly onPress?: (item: HomeNewsItem) => void;
}) {
  const style = [
    styles.card,
    { width, minHeight: imageHeight + 8 + (isTablet ? 48 : NEWS_TITLE_HEIGHT) },
  ];
  const content = (
    <>
      <Image
        source={item.image}
        resizeMode="cover"
        style={[styles.newsImage, { height: imageHeight }]}
      />
      <Text
        numberOfLines={2}
        style={[
          styles.newsTitle,
          isTablet ? styles.tabletNewsTitle : undefined,
        ]}
      >
        {item.title}
      </Text>
    </>
  );

  if (!onPress) {
    return <View style={style}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(item)}
      style={style}
    >
      {content}
    </Pressable>
  );
}

export function HomeNewsSection({
  onPressAll,
  onPressItem,
}: HomeNewsSectionProps) {
  const responsive = useResponsive();
  const cardWidth = resolveHomeNewsCardWidth(responsive);
  const imageHeight = cardWidth / FIGMA_NEWS_IMAGE_ASPECT_RATIO;
  const maxSectionWidth = responsive.isTablet
    ? TABLET_MAX_SECTION_WIDTH
    : MAX_SECTION_WIDTH;
  const newsCards = HOME_NEWS.map(item => (
    <NewsCard
      imageHeight={imageHeight}
      isTablet={responsive.isTablet}
      item={item}
      key={item.id}
      onPress={onPressItem}
      width={cardWidth}
    />
  ));

  return (
    <View
      accessibilityLabel="Tin tức và sự kiện"
      style={[styles.container, { maxWidth: maxSectionWidth }]}
    >
      <View style={styles.headingRow}>
        <Text accessibilityRole="header" style={styles.heading}>
          Tin tức &amp; Sự kiện
        </Text>
        {onPressAll ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={onPressAll}
          >
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </Pressable>
        ) : (
          <Text style={styles.viewAll}>Xem tất cả</Text>
        )}
      </View>

      {HOME_NEWS.length > 2 ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.newsScroller}
        >
          {newsCards}
        </ScrollView>
      ) : (
        <View style={styles.newsRow}>{newsCards}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: MAX_SECTION_WIDTH,
    alignSelf: 'center',
  },
  headingRow: {
    height: 20,
    marginHorizontal: SECTION_HORIZONTAL_PADDING,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heading: {
    ...typography.heading.md,
    color: semanticColors.text.primary,
  },
  viewAll: {
    fontFamily: typography.body.md.fontFamily,
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: typography.body.md.fontWeight,
    letterSpacing: 0,
    color: primitiveColors.neutral[300],
    textDecorationLine: 'underline',
  },
  newsRow: {
    marginTop: 16,
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
    flexDirection: 'row',
    gap: NEWS_GAP,
  },
  newsScroller: {
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
    flexDirection: 'row',
    gap: NEWS_GAP,
  },
  card: {
    flexShrink: 0,
    gap: 8,
  },
  newsImage: {
    width: '100%',
    borderRadius: radius.sm,
  },
  newsTitle: {
    ...typography.label.md,
    width: '100%',
    color: semanticColors.text.primary,
  },
  tabletNewsTitle: {
    fontSize: 15,
    lineHeight: 21,
  },
});
