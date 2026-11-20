# videos

Video library and the player (ADR-0015).

```text
VideoLibraryScreen: VideoSearchHeader + VideoCategoryTabs + VideoListItem
        | open video
VideoPlayerScreen -> VideoPlaybackSurface -> useVideoPlayback -> react-native-video
```

- `useVideoPlayback` owns paused, muted, rate, buffering, progress and error state.
- Playback pauses whenever the app leaves the foreground (`AppState`).
- Retry bumps `reloadKey`; the player is keyed by it, so it is remounted cleanly.
- Native behaviour changes need a debug Android build (see CONTRIBUTING).
