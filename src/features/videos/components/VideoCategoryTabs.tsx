import { semanticColors, typography } from '@jujistu/shared/theme';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { VIDEO_CATEGORIES } from '../data/video-content';
import type { VideoCategory } from '../types/video.types';

export interface VideoCategoryTabsProps {
  readonly activeCategory: VideoCategory;
  readonly onChange: (category: VideoCategory) => void;
}

export function VideoCategoryTabs({
  activeCategory,
  onChange,
}: VideoCategoryTabsProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
    >
      {VIDEO_CATEGORIES.map(category => {
        const selected = category.key === activeCategory;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={category.key}
            onPress={() => onChange(category.key)}
            style={[styles.tab, selected ? styles.selectedTab : undefined]}
          >
            <Text
              style={[
                styles.label,
                selected ? styles.selectedLabel : undefined,
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border.default,
  },
  content: {
    minWidth: '100%',
    alignItems: 'flex-end',
  },
  tab: {
    minWidth: 78,
    height: 48,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: semanticColors.text.primary,
  },
  label: {
    ...typography.label.md,
    color: semanticColors.text.tertiary,
  },
  selectedLabel: {
    ...typography.heading.sm,
    color: semanticColors.text.primary,
  },
});
