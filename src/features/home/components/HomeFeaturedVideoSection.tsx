import { useResponsive } from '@jujistu/shared/constants/responsive';
import { radius, semanticColors, typography } from '@jujistu/shared/theme';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  readonly onPressAll?: () => void;
  readonly onPressItem?: (item: HomeVideoItem) => void;
}

function SectionLink({
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

function VideoCard({
  cardHeight,
  cardWidth,
  item,
  onPress,
  scale,
}: {
  readonly cardHeight: number;
  readonly cardWidth: number;
  readonly item: HomeVideoItem;
  readonly onPress?: (item: HomeVideoItem) => void;
  readonly scale: number;
}) {
  const cardStyle = [styles.card, { width: cardWidth, gap: 8 * scale }];
  const content = (
    <>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={item.image}
        style={[styles.image, { height: cardHeight, width: cardWidth }]}
      />
      <Text
        numberOfLines={1}
        style={[
          styles.title,
          {
            fontSize: (typography.subtitle.md.fontSize as number) * scale,
            lineHeight: (typography.subtitle.md.lineHeight as number) * scale,
            width: cardWidth,
          },
        ]}
      >
        {item.title}
      </Text>
    </>
  );

  if (!onPress) {
    return <View style={cardStyle}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityLabel={item.title}
      accessibilityRole="button"
      onPress={() => onPress(item)}
      style={cardStyle}
    >
      {content}
    </Pressable>
  );
}

export function HomeFeaturedVideoSection({
  onPressAll,
  onPressItem,
}: HomeFeaturedVideoSectionProps) {
  const responsive = useResponsive();
  const geometry = resolveHomeFeaturedVideoGeometry(responsive.width);
  const cards = HOME_FEATURED_VIDEOS.map(item => (
    <VideoCard
      cardHeight={geometry.cardHeight}
      cardWidth={geometry.cardWidth}
      item={item}
      key={item.id}
      onPress={onPressItem}
      scale={geometry.scale}
    />
  ));

  return (
    <View
      accessibilityLabel="Video nổi bật"
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
          Video nổi bật
        </Text>
        <SectionLink onPress={onPressAll} scale={geometry.scale} />
      </View>
      {HOME_FEATURED_VIDEOS.length > 2 ? (
        <ScrollView
          contentContainerStyle={[
            styles.cards,
            { gap: geometry.cardGap, marginTop: 6 * geometry.scale },
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {cards}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.cards,
            { gap: geometry.cardGap, marginTop: 6 * geometry.scale },
          ]}
        >
          {cards}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  headingRow: {
    marginHorizontal: 1,
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
  cards: {
    flexDirection: 'row',
  },
  card: {
    flexShrink: 0,
  },
  image: {
    borderRadius: radius.sm,
  },
  title: {
    ...typography.subtitle.md,
    color: semanticColors.text.primary,
  },
});
