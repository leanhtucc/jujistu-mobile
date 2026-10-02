# ADR 0015 Video feature and playback lifecycle

- Status: Accepted
- Date: 2026-09-28

## Context

Home presents a small Video nổi bật preview. The full browsing, search, detail, and
playback flow is a distinct user capability and must not increase Home ownership.
Playback also crosses native media lifecycles, audio focus, application background
state, buffering, fullscreen presentation, and network failure.

## Decision

- `src/features/videos` owns video screens, components, feature data, types, and
  playback lifecycle behavior.
- Home emits `videoId` selections and does not import the video feature.
- `src/app/navigation` composes the `Videos` and `VideoPlayer` destinations. Route
  state carries only a serializable `videoId`.
- `react-native-video` 6.19.2 is pinned as the native playback bridge. Version 7 is
  beta and is deferred.
- The player starts paused, disables background and inactive playback, pauses when
  the app leaves the foreground, pauses when audio focus is lost or audio becomes
  noisy, exposes buffering, handles end of media, and offers bounded retry after an
  error.
- Playback logs contain no media URLs, credentials, or raw native error payloads.
- The video feature uses the current application logo from `assets/app/LogoApp.png`.
  Figma channel logos are not added to the runtime UI.
- Figma thumbnails and control glyphs are local repository assets. Runtime code has
  no dependency on expiring Figma URLs.

## Consequences

- The Home feature remains small and cannot depend on video internals.
- Adding the native media dependency requires Android validation and iOS validation
  on macOS before release.
- Backend integration can replace the feature data source without changing screen
  or playback ownership. A future remote operation must follow the feature hook to
  feature service to shared HTTP transport boundary.
- DRM, Picture in Picture, background audio, offline download, casting, and
  user-provided media URLs remain outside the current scope.
