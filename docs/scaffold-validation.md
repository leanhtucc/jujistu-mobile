# React Native Scaffold Validation

Validated on: 2026-09-13

## Identity

- React Native project/component: `JUJISTU`
- Display name: `JUJISTU`
- npm package name: `jujistu`
- Android namespace/application ID: `com.jujistu.app`
- iOS bundle identifier: `com.jujistu.app`

## Generated baseline

- React Native: `0.87.1`
- React: `19.2.3`
- React Native Community CLI: `20.2.0`
- TypeScript: template-provided `^6.0.3`
- Package manager: npm with committed `package-lock.json`

No application dependency was added beyond the React Native template.

## Generator correction

The Community CLI `--package-name` option generated the requested native identifier,
but also used it as the npm and Gradle root project name and produced a nonstandard
Kotlin source directory. Before the first build, the scaffold was normalized to:

- npm name `jujistu`;
- Gradle root project `JUJISTU`;
- Kotlin sources under `android/app/src/main/java/com/jujistu/app`; and
- Kotlin package declarations kept as `com.jujistu.app`.

React Native CLI configuration then resolved:

```text
Android package: com.jujistu.app
Android activity: .MainActivity
iOS project: JUJISTU.xcodeproj
```

## Verification results

- ESLint: passed.
- TypeScript `tsc --noEmit`: passed.
- Jest: 1 suite and 1 test passed.
- Android `:app:assembleDebug`: passed.
- APK package: `com.jujistu.app`.
- APK compile SDK: 37.
- APK minimum SDK: 24.
- APK target SDK: 36.
- APK installation on `Pixel_8_Pro`: passed.
- `com.jujistu.app/.MainActivity`: launched and reached resumed state.
- Runtime log check: no fatal exception, bundle-load failure, or React Native JS error.
- iOS build: pending macOS validation.

## Local build note

The Codex Windows execution environment required a short process-local `TEMP` and
`TMP` path for Gradle because sandboxed JVM loopback initialization failed with the
normal temporary path. This is an agent execution-environment workaround, not a
project setting, and must not be committed to Gradle configuration without a
separate reproducibility review.

Warnings from the unmodified RN 0.87 template and its default
`react-native-safe-area-context` dependency were observed for APIs that AGP 9 marks
as deprecated. They did not fail the build. Do not patch generated dependencies;
review them during controlled dependency upgrades.
