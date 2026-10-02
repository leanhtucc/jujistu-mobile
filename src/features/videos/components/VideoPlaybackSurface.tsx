import { semanticColors, typography } from '@jujistu/shared/theme';
import { AppButton, AppIcon } from '@jujistu/ui';
import React, { useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video, { type VideoRef } from 'react-native-video';

import { useVideoPlayback } from '../hooks/use-video-playback';
import type { FeaturedVideo } from '../types/video.types';
import { FullscreenGlyph } from './FullscreenGlyph';

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function ControlButton({
  accessibilityLabel,
  children,
  onPress,
}: {
  readonly accessibilityLabel: string;
  readonly children: React.ReactNode;
  readonly onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={styles.controlButton}
    >
      {children}
    </Pressable>
  );
}

export interface VideoPlaybackSurfaceProps {
  readonly video: FeaturedVideo;
}

export function VideoPlaybackSurface({ video }: VideoPlaybackSurfaceProps) {
  const videoRef = useRef<VideoRef>(null);
  const playback = useVideoPlayback(videoRef);
  const progress = useMemo(() => {
    if (playback.duration <= 0) {
      return 0;
    }
    return clamp(playback.currentTime / playback.duration, 0, 1);
  }, [playback.currentTime, playback.duration]);
  const showPoster = !playback.isLoaded;

  return (
    <View accessibilityLabel={`Trình phát ${video.title}`} style={styles.root}>
      <Video
        key={`${video.id}-${playback.reloadKey}`}
        muted={playback.isMuted}
        onAudioBecomingNoisy={playback.pause}
        onAudioFocusChanged={playback.handleAudioFocusChanged}
        onBuffer={playback.handleBuffer}
        onEnd={playback.handleEnd}
        onError={playback.handleError}
        onLoad={playback.handleLoad}
        onProgress={playback.handleProgress}
        paused={playback.paused}
        playInBackground={false}
        playWhenInactive={false}
        progressUpdateInterval={250}
        rate={playback.playbackRate}
        ref={videoRef}
        resizeMode="cover"
        source={{
          uri: video.mediaUri,
          headers: {
            'User-Agent': 'JUJISTU-App/1.0 (Android; Mobile)',
          },
        }}
        style={styles.video}
      />

      {showPoster ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={video.thumbnail}
          style={styles.poster}
        />
      ) : null}

      {playback.errorMessage ? (
        <View accessibilityRole="alert" style={styles.errorOverlay}>
          <Text style={styles.errorText}>{playback.errorMessage}</Text>
          <AppButton
            appearance="filled"
            label="Thử lại"
            onPress={playback.retry}
            size="sm"
          />
        </View>
      ) : null}

      {playback.isBuffering && !playback.errorMessage ? (
        <View pointerEvents="none" style={styles.loadingOverlay}>
          <ActivityIndicator color={semanticColors.icon.primary} size="large" />
        </View>
      ) : null}

      {!playback.errorMessage ? (
        <View style={styles.controls}>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <View style={styles.controlRow}>
            <View style={styles.controlGroup}>
              <ControlButton
                accessibilityLabel={
                  playback.paused ? 'Phát video' : 'Tạm dừng video'
                }
                onPress={playback.togglePaused}
              >
                {playback.paused ? (
                  <AppIcon name="play" size={20} />
                ) : (
                  <Text style={styles.pauseIcon}>Ⅱ</Text>
                )}
              </ControlButton>
              <ControlButton
                accessibilityLabel={
                  playback.isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'
                }
                onPress={playback.toggleMuted}
              >
                <AppIcon
                  color={
                    playback.isMuted
                      ? semanticColors.icon.tertiary
                      : semanticColors.icon.primary
                  }
                  name="volumeUp"
                  size={20}
                />
              </ControlButton>
            </View>
            <View style={styles.controlGroup}>
              <ControlButton
                accessibilityLabel={`Tốc độ phát ${playback.playbackRate}x`}
                onPress={playback.cyclePlaybackRate}
              >
                <Text style={styles.rateLabel}>{playback.playbackRate}x</Text>
              </ControlButton>
              <ControlButton
                accessibilityLabel="Mở toàn màn hình"
                onPress={() => videoRef.current?.setFullScreen(true)}
              >
                <FullscreenGlyph />
              </ControlButton>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    aspectRatio: 390 / 218,
    overflow: 'hidden',
    backgroundColor: semanticColors.background.canvasDeep,
  },
  video: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  poster: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
  progressTrack: {
    width: '100%',
    height: 2,
    backgroundColor: semanticColors.border.subtle,
  },
  progressFill: {
    height: 2,
    backgroundColor: semanticColors.action.primary,
  },
  controlRow: {
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    minWidth: 20,
    minHeight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: {
    ...typography.heading.md,
    color: semanticColors.text.primary,
  },
  rateLabel: {
    ...typography.caption.sm,
    minWidth: 24,
    color: semanticColors.text.primary,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: semanticColors.background.overlay,
  },
  errorText: {
    ...typography.body.md,
    color: semanticColors.text.primary,
    textAlign: 'center',
  },
});
