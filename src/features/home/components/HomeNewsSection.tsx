import {
  primitiveColors,
  radius,
  semanticColors,
  typography,
} from '@jujistu/shared/theme';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { HOME_NEWS, type HomeNewsItem } from '../home-content';

export interface HomeNewsSectionProps {
  readonly onPressAll?: () => void;
  readonly onPressItem?: (item: HomeNewsItem) => void;
}

function NewsCard({
  item,
  onPress,
}: {
  readonly item: HomeNewsItem;
  readonly onPress?: (item: HomeNewsItem) => void;
}) {
  const content = (
    <>
      <Image source={item.image} resizeMode="cover" style={styles.newsImage} />
      <Text numberOfLines={2} style={styles.newsTitle}>
        {item.title}
      </Text>
    </>
  );

  if (!onPress) {
    return <View style={styles.card}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(item)}
      style={styles.card}
    >
      {content}
    </Pressable>
  );
}

export function HomeNewsSection({
  onPressAll,
  onPressItem,
}: HomeNewsSectionProps) {
  return (
    <View>
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

      <View style={styles.newsRow}>
        {HOME_NEWS.map(item => (
          <NewsCard item={item} key={item.id} onPress={onPressItem} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headingRow: {
    height: 20,
    marginHorizontal: 16,
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
    height: 135,
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    minWidth: 0,
    flex: 1,
    height: 135,
    gap: 8,
  },
  newsImage: {
    width: '100%',
    height: 97,
    borderRadius: radius.sm,
  },
  newsTitle: {
    ...typography.label.sm,
    width: '100%',
    color: semanticColors.text.primary,
  },
});
