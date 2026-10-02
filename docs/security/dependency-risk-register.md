# Dependency risk register

Last reviewed: 2026-09-28

## Open advisories

### React Native 0.87 / Metro toolchain

`npm audit --omit=dev` reports high-severity denial-of-service advisories in the
React Native 0.87.1 Metro dependency tree. npm currently suggests downgrading core
packages to 0.86.3, which is not a compatible patch and would violate the accepted
project baseline.

Decision: do not use `npm audit fix --force` or downgrade individual React Native
packages. Track an upstream 0.87 patch and upgrade the complete matching React
Native package set together after native validation.

### React Navigation URL parsing

React Navigation 7.3.18 currently resolves `query-string` 7.1.3, which depends on a
version of `decode-uri-component` affected by GHSA-vcc3-ghjq-m6fr. npm reports no
compatible fix for the latest stable React Navigation 7 release.

Current exposure is limited because JUJISTU does not enable external deep linking
or parse untrusted URLs into navigation state.

Decision:

- do not enable deep linking until the advisory is fixed or a focused threat review
  accepts a mitigation;
- do not switch the production base to React Navigation 8 alpha solely to silence
  the audit;
- review this entry whenever React Navigation is upgraded; and
- treat any external URL-navigation feature as security-sensitive.

### React Native Video 6

`react-native-video` 6.19.2 provides the Android Media3 and iOS AVPlayer bridge used
by the video feature. Version 6 is the current stable line and supports React Native
0.68.2 or newer, including the New Architecture. Version 7 remains beta and is not
used in the production dependency set. The 2026-09-28 production audit reported no
advisory whose direct or transitive cause was `react-native-video`.

Media URLs are treated as content, never credentials. Playback failures are logged
without the URL or raw native error payload. The player disables background and
inactive playback, pauses when audio focus is lost, and uses HTTPS sources.

Decision:

- pin 6.19.2 until a focused native upgrade validates a newer stable release;
- do not enable DRM, Picture in Picture, background audio, downloaded media, or
  arbitrary user-provided URLs without a separate product and security review;
- validate Android and iOS native builds after dependency changes; and
- review upstream releases and audit output whenever the package is upgraded.

## Review process

Run `npm audit --omit=dev` for dependency pull requests. Audit output is evidence,
not an instruction to apply breaking upgrades automatically. Document unresolved
runtime advisories here with exposure, mitigation, owner, and review trigger.
