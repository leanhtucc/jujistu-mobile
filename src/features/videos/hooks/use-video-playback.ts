import { createLogger } from '@jujistu/shared/logger/logger';
import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type {
  OnAudioFocusChangedData,
  OnBufferData,
  OnLoadData,
  OnProgressData,
  OnVideoErrorData,
  VideoRef,
} from 'react-native-video';

const log = createLogger('VideoPlayback');

export interface VideoPlaybackController {
  readonly currentTime: number;
  readonly duration: number;
  readonly errorMessage: string | null;
  readonly isBuffering: boolean;
  readonly isLoaded: boolean;
  readonly isMuted: boolean;
  readonly playbackRate: number;
  readonly reloadKey: number;
  readonly paused: boolean;
  readonly handleAudioFocusChanged: (data: OnAudioFocusChangedData) => void;
  readonly handleBuffer: (data: OnBufferData) => void;
  readonly handleEnd: () => void;
  readonly handleError: (data: OnVideoErrorData) => void;
  readonly handleLoad: (data: OnLoadData) => void;
  readonly handleProgress: (data: OnProgressData) => void;
  readonly pause: () => void;
  readonly retry: () => void;
  readonly toggleMuted: () => void;
  readonly togglePaused: () => void;
  readonly cyclePlaybackRate: () => void;
}

const PLAYBACK_RATES = [1, 1.25, 1.5, 0.75] as const;

export function useVideoPlayback(
  videoRef: React.RefObject<VideoRef | null>,
): VideoPlaybackController {
  const [paused, setPaused] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [isBuffering, setBuffering] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const pause = useCallback(() => setPaused(true), []);

  useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state !== 'active') {
        setPaused(true);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription.remove();
  }, []);

  const handleLoad = useCallback((data: OnLoadData) => {
    setLoaded(true);
    setBuffering(false);
    setDuration(Number.isFinite(data.duration) ? data.duration : 0);
    setErrorMessage(null);
  }, []);

  const handleBuffer = useCallback((data: OnBufferData) => {
    setBuffering(data.isBuffering);
  }, []);

  const handleProgress = useCallback((data: OnProgressData) => {
    if (Number.isFinite(data.currentTime)) {
      setCurrentTime(data.currentTime);
    }
  }, []);

  const handleEnd = useCallback(() => {
    setPaused(true);
    setCurrentTime(0);
    videoRef.current?.seek(0);
  }, [videoRef]);

  const handleError = useCallback((data: OnVideoErrorData) => {
    log.error('Video playback failed', data.error);
    setPaused(true);
    setBuffering(false);
    setLoaded(false);
    setErrorMessage('Không thể phát video. Vui lòng thử lại.');
  }, []);

  const handleAudioFocusChanged = useCallback(
    (data: OnAudioFocusChangedData) => {
      if (!data.hasAudioFocus) {
        setPaused(true);
      }
    },
    [],
  );

  const retry = useCallback(() => {
    setPaused(true);
    setBuffering(false);
    setLoaded(false);
    setCurrentTime(0);
    setDuration(0);
    setErrorMessage(null);
    setReloadKey(value => value + 1);
  }, []);

  const togglePaused = useCallback(() => {
    if (!errorMessage) {
      setPaused(value => !value);
    }
  }, [errorMessage]);

  const toggleMuted = useCallback(() => setMuted(value => !value), []);

  const cyclePlaybackRate = useCallback(() => {
    setPlaybackRate(current => {
      const currentIndex = PLAYBACK_RATES.indexOf(
        current as (typeof PLAYBACK_RATES)[number],
      );
      return PLAYBACK_RATES[(currentIndex + 1) % PLAYBACK_RATES.length];
    });
  }, []);

  return {
    currentTime,
    duration,
    errorMessage,
    isBuffering,
    isLoaded,
    isMuted,
    playbackRate,
    reloadKey,
    paused,
    handleAudioFocusChanged,
    handleBuffer,
    handleEnd,
    handleError,
    handleLoad,
    handleProgress,
    pause,
    retry,
    toggleMuted,
    togglePaused,
    cyclePlaybackRate,
  };
}
