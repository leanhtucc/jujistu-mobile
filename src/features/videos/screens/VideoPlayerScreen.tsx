import { semanticColors, typography } from '@jujistu/shared/theme';
import {
  getResponsiveContentWidth,
  scaleResponsiveValue,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { AppHeader } from '@jujistu/ui';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VideoPlaybackSurface } from '../components/VideoPlaybackSurface';
import { getFeaturedVideo } from '../data/video-content';

const currentAppLogo = require('../../../../assets/app/LogoApp.png');

export interface VideoPlayerScreenProps {
  readonly onBack: () => void;
  readonly videoId: string;
}

export function VideoPlayerScreen({ onBack, videoId }: VideoPlayerScreenProps) {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const contentWidth = getResponsiveContentWidth(responsive, 0);
  const textScale = scaleResponsiveValue(1, responsive, {
    maxScale: 1.35,
    roundToPixel: false,
  });
  const video = getFeaturedVideo(videoId);

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top }} />
      <AppHeader
        backAccessibilityLabel="Quay lại danh sách video"
        onBackPress={onBack}
        title="Video nổi bật"
      />
      {video ? (
        <View style={[styles.content, { width: contentWidth }]}>
          <VideoPlaybackSurface video={video} />
          <View style={styles.metadata}>
            <Text
              accessibilityRole="header"
              style={[
                styles.title,
                {
                  fontSize:
                    (typography.heading.lg.fontSize as number) * textScale,
                  lineHeight:
                    (typography.heading.lg.lineHeight as number) * textScale,
                },
              ]}
            >
              {video.title}
            </Text>
            <View style={styles.channelRow}>
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={currentAppLogo}
                style={[
                  styles.logo,
                  { height: 28 * textScale, width: 28 * textScale },
                ]}
              />
              <Text
                style={[
                  styles.channel,
                  {
                    fontSize:
                      (typography.body.md.fontSize as number) * textScale,
                    lineHeight:
                      (typography.body.md.lineHeight as number) * textScale,
                  },
                ]}
              >
                {video.channelName}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View accessibilityRole="alert" style={styles.notFound}>
          <Text style={styles.notFoundText}>Video không tồn tại.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.background.canvasDeep,
  },
  content: {
    alignSelf: 'center',
  },
  metadata: {
    padding: 16,
    gap: 8,
  },
  title: {
    ...typography.heading.lg,
    color: semanticColors.text.primary,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
  },
  channel: {
    ...typography.body.md,
    color: semanticColors.text.secondary,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    ...typography.body.md,
    color: semanticColors.text.secondary,
  },
});
