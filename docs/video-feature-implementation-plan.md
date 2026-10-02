# Video nổi bật implementation plan

## Goal

Implement the four supplied Figma states as an independent video feature. The flow
starts from Xem tất cả on Home, keeps the screen title Video nổi bật, uses the
existing JUJISTU logo, and handles common native playback failures without coupling
the player to Home.

## Scope

The implementation covers the video library, category filtering, search, portrait
playback, native fullscreen playback, buffering, retry, app lifecycle, audio focus,
accessibility, typed navigation, local Figma assets, tests, and technical
documentation.

The current release does not add backend fetching, authentication rules for media,
DRM, downloads, casting, Picture in Picture, background audio, analytics, or user
supplied URLs.

## Architecture

1. Create `src/features/videos` with `screens`, `components`, `hooks`, `data`,
   `types`, and a narrow public `index.ts`.
2. Keep Home responsible only for its preview cards and callbacks.
3. Add `Videos` and `VideoPlayer` to the application stack.
4. Pass only `videoId` through navigation and resolve content inside the feature.
5. Keep playback lifecycle in `use-video-playback.ts`; presentational components do
   not own application navigation.

## UI implementation

1. Build the list header with the shared `AppHeader` and the title Video nổi bật.
2. Implement horizontally scrollable category tabs for Tất cả, Tin tức, Faceoff,
   Highlight, and Full fight.
3. Render Figma thumbnails with duration badges and metadata rows.
4. Replace every Figma channel logo with `assets/app/LogoApp.png`.
5. Implement a focused search state with keyboard-safe compact results.
6. Build the portrait player with poster, progress, play or pause, mute, rate, retry,
   and fullscreen controls.
7. Delegate landscape presentation to the native fullscreen player so Android and
   iOS manage orientation through their supported media surface.

## Playback reliability

1. Pin the stable `react-native-video` 6 line and avoid the version 7 beta.
2. Start paused and require a user action before playback.
3. Pause on app background or inactive state.
4. Pause on Android audio focus loss and headphone disconnect events.
5. Track load, duration, progress, buffer, end, and error events.
6. Do not show raw native errors or media URLs to the user or logger.
7. Retry by remounting one player instance with cleared transient state.
8. Disable background and inactive playback explicitly.
9. Keep one player on the playback screen; list cards are images and never create
   hidden media instances.

## Validation

1. Test filtering, search, title copy, navigation contracts, and error recovery.
2. Run formatting, lint, architecture, TypeScript, and the full Jest suite.
3. Run `npm audit --omit=dev` and record unresolved advisories separately.
4. Build Android debug because a native dependency was added.
5. Install and exercise list, search, play, pause, mute, retry, and fullscreen on the
   connected CPH2591 device.
6. Require a macOS iOS build before release; Windows cannot validate CocoaPods or
   AVPlayer integration.

## Acceptance criteria

- Xem tất cả opens a screen titled Video nổi bật.
- Video code is outside `src/features/home`.
- Search and category states match the supplied Figma hierarchy.
- Video rows and player metadata use the current JUJISTU logo.
- Selecting a card opens the correct `videoId` without passing a full object.
- Playback can pause, resume, mute, change rate, retry, and enter fullscreen.
- Backgrounding, audio focus loss, end, buffering, and errors have explicit handling.
- No expiring Figma URL remains in runtime source.
- Required checks and Android debug build pass.
