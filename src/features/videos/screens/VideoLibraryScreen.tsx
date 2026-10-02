import { semanticColors, typography } from '@jujistu/shared/theme';
import {
  getResponsiveContentWidth,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { AppHeader } from '@jujistu/ui';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VideoCategoryTabs } from '../components/VideoCategoryTabs';
import { VideoListItem } from '../components/VideoListItem';
import { filterFeaturedVideos } from '../data/video-content';
import type { VideoCategory } from '../types/video.types';
import { VideoSearchHeader } from '../components/VideoSearchHeader';

export interface VideoLibraryScreenProps {
  readonly onBack: () => void;
  readonly onSelectVideo: (videoId: string) => void;
}

export function VideoLibraryScreen({
  onBack,
  onSelectVideo,
}: VideoLibraryScreenProps) {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const contentWidth = getResponsiveContentWidth(responsive, 0);
  const [activeCategory, setActiveCategory] =
    useState<VideoCategory>('faceoff');
  const [isSearching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const videos = useMemo(
    () =>
      isSearching
        ? filterFeaturedVideos('all', searchQuery)
        : filterFeaturedVideos(activeCategory, ''),
    [activeCategory, isSearching, searchQuery],
  );

  const closeSearch = () => {
    setSearching(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top }} />
      {isSearching ? (
        <VideoSearchHeader
          onBack={closeSearch}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      ) : (
        <>
          <AppHeader
            backAccessibilityLabel="Quay lại Home"
            onBackPress={onBack}
            title="Video nổi bật"
            trailingAction={{
              accessibilityLabel: 'Tìm video',
              icon: 'search',
              onPress: () => setSearching(true),
            }}
          />
          <VideoCategoryTabs
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </>
      )}

      <FlatList
        contentContainerStyle={
          videos.length === 0 ? styles.emptyContainer : styles.listContent
        }
        data={videos}
        initialNumToRender={3}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text accessibilityRole="text" style={styles.emptyText}>
            Không tìm thấy video phù hợp.
          </Text>
        }
        maxToRenderPerBatch={4}
        renderItem={({ item }) => (
          <VideoListItem
            compact={isSearching}
            item={item}
            onPress={onSelectVideo}
          />
        )}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        style={[styles.list, { width: contentWidth }]}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.background.canvasDeep,
  },
  list: {
    alignSelf: 'center',
    width: '100%',
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body.md,
    color: semanticColors.text.secondary,
    textAlign: 'center',
  },
});
