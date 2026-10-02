import { useResponsive } from '@jujistu/shared/constants/responsive';
import { radius, semanticColors, typography } from '@jujistu/shared/theme';
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
  readonly onPressAll?: () => void;
  readonly onPressItem?: (item: HomeNewsItem) => void;
}

function NewsItem({
  contentGap,
  imageHeight,
  imageWidth,
  item,
  onPress,
  scale,
}: {
  readonly contentGap: number;
  readonly imageHeight: number;
  readonly imageWidth: number;
  readonly item: HomeNewsItem;
  readonly onPress?: (item: HomeNewsItem) => void;
  readonly scale: number;
}) {
  const content = (
    <>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={item.image}
        style={[styles.image, { height: imageHeight, width: imageWidth }]}
      />
      <View style={[styles.copy, { minHeight: imageHeight }]}>
        <Text
          numberOfLines={3}
          style={[
            styles.description,
            {
              fontSize: (typography.subtitle.md.fontSize as number) * scale,
              lineHeight: (typography.subtitle.md.lineHeight as number) * scale,
            },
          ]}
        >
          {item.description}
        </Text>
        <Text
          style={[
            styles.date,
            {
              fontSize: (typography.body.md.fontSize as number) * scale,
              lineHeight: (typography.body.md.lineHeight as number) * scale,
            },
          ]}
        >
          {item.date}
        </Text>
      </View>
    </>
  );
  const style = [
    styles.item,
    { columnGap: contentGap, minHeight: imageHeight },
  ];

  if (!onPress) {
    return <View style={style}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityLabel={`${item.description}, ${item.date}`}
      accessibilityRole="button"
      onPress={() => onPress(item)}
      style={style}
    >
      {content}
    </Pressable>
  );
}

function ViewAllLink({
  onPress,
  scale,
}: {
  readonly onPress?: () => void;
  readonly scale: number;
}) {
  const textStyle = {
    fontSize: (typography.body.md.fontSize as number) * scale,
    lineHeight: (typography.body.md.lineHeight as number) * scale,
  };

  if (!onPress) {
    return <Text style={[styles.viewAll, textStyle]}>Xem tất cả</Text>;
  }

  return (
    <Pressable accessibilityRole="button" hitSlop={8} onPress={onPress}>
      <Text style={[styles.viewAll, textStyle]}>Xem tất cả</Text>
    </Pressable>
  );
}

export function HomeNewsSection({
  onPressAll,
  onPressItem,
}: HomeNewsSectionProps) {
  const responsive = useResponsive();
  const geometry = resolveHomeNewsGeometry(responsive.width);

  return (
    <View
      accessibilityLabel="Tin tức và sự kiện"
      style={[styles.container, { width: geometry.sectionWidth }]}
    >
      <View style={[styles.headingRow, { minHeight: 20 * geometry.scale }]}>
        <Text
          accessibilityRole="header"
          style={[
            styles.heading,
            {
              fontSize:
                (typography.heading.md.fontSize as number) * geometry.scale,
              lineHeight:
                (typography.heading.md.lineHeight as number) * geometry.scale,
            },
          ]}
        >
          Tin tức &amp; Sự kiện
        </Text>
        <ViewAllLink onPress={onPressAll} scale={geometry.scale} />
      </View>
      <View
        style={[
          styles.items,
          { gap: 12 * geometry.scale, marginTop: 6 * geometry.scale },
        ]}
      >
        {HOME_NEWS.map(item => (
          <NewsItem
            contentGap={geometry.contentGap}
            imageHeight={geometry.imageHeight}
            imageWidth={geometry.imageWidth}
            item={item}
            key={item.id}
            onPress={onPressItem}
            scale={geometry.scale}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heading: {
    ...typography.heading.md,
    color: semanticColors.text.primary,
  },
  viewAll: {
    ...typography.body.md,
    color: semanticColors.text.tertiary,
    textDecorationLine: 'underline',
  },
  items: {},
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    flexShrink: 0,
    borderRadius: radius.sm,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
  },
  description: {
    ...typography.subtitle.md,
    color: semanticColors.text.primary,
  },
  date: {
    ...typography.body.md,
    color: semanticColors.text.secondary,
  },
});
