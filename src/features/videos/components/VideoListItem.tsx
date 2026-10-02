import { semanticColors, typography } from '@jujistu/shared/theme';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { FeaturedVideo } from '../types/video.types';

const currentAppLogo = require('../../../../assets/app/LogoApp.png');

export interface VideoListItemProps {
  readonly compact?: boolean;
  readonly item: FeaturedVideo;
  readonly onPress: (videoId: string) => void;
}

export function VideoListItem({
  compact = false,
  item,
  onPress,
}: VideoListItemProps) {
  if (compact) {
    return (
      <Pressable
        accessibilityLabel={`Phát ${item.title}`}
        accessibilityRole="button"
        onPress={() => onPress(item.id)}
        style={styles.compactContainer}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={item.thumbnail}
          style={styles.compactThumbnail}
        />
        <View style={styles.compactText}>
          <Text numberOfLines={1} style={styles.compactTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.date}>
            {item.publishedAt}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityLabel={`Phát ${item.title}`}
      accessibilityRole="button"
      onPress={() => onPress(item.id)}
      style={styles.container}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={item.thumbnail}
          style={styles.thumbnail}
        />
        <View style={styles.durationBadge}>
          <Text style={styles.duration}>{item.durationLabel}</Text>
        </View>
      </View>
      <View style={styles.metadata}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={currentAppLogo}
          style={styles.logo}
        />
        <View style={styles.metadataText}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.date}>{item.publishedAt}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: semanticColors.background.canvasDeep,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 390 / 218,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    minWidth: 40,
    margin: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: semanticColors.background.overlay,
  },
  duration: {
    ...typography.body.sm,
    color: semanticColors.text.primary,
  },
  metadata: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
    flexShrink: 0,
  },
  metadataText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.heading.md,
    color: semanticColors.text.primary,
  },
  date: {
    ...typography.body.sm,
    color: semanticColors.text.secondary,
  },
  compactContainer: {
    minHeight: 74,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border.default,
  },
  compactThumbnail: {
    width: 88,
    height: 50,
    flexShrink: 0,
  },
  compactText: {
    flex: 1,
    gap: 2,
  },
  compactTitle: {
    ...typography.heading.sm,
    color: semanticColors.text.primary,
  },
});
