# JUJISTU Development Environment Baseline

Last verified on Windows: 2026-09-13

## Required baseline

All contributors must use tool versions compatible with the generated React Native
`0.87.1` template. Do not independently upgrade native build tools in a feature
pull request.

| Tool                       | Project baseline                  | Verified on this workstation           |
| -------------------------- | --------------------------------- | -------------------------------------- |
| Node.js                    | `22.16.0`                         | `22.16.0`                              |
| npm                        | `10.9.2`                          | `10.9.2`                               |
| Git                        | Modern supported release          | `2.48.1.windows.1`                     |
| Java                       | JDK 17                            | Microsoft OpenJDK `17.0.15`            |
| Android SDK Platform       | 37                                | `android-37.0` installed               |
| Android Build Tools        | 37                                | `37.0.0` installed                     |
| Android Command-line Tools | Latest stable                     | Installed under `cmdline-tools/latest` |
| Android emulator           | Current stable compatible version | `36.6.11.0`                            |
| Android Virtual Device     | At least one team test device     | `Pixel_8_Pro`                          |

## Windows environment

The verified environment uses:

```text
JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.15.6-hotspot
ANDROID_HOME=C:\Users\Microsoft\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\Microsoft\AppData\Local\Android\Sdk
```

`platform-tools` is available on `PATH`. The emulator directory is not currently on
`PATH`; the AVD can be launched from Android Studio or by using the full emulator
path. This does not block the initial Android build.

## iOS requirement

iOS native builds cannot be validated on Windows. Before the first feature pull
request is merged, a macOS workstation or macOS CI runner must verify:

- current Xcode and Xcode Command Line Tools;
- the Ruby/Bundler versions selected by the generated template;
- `bundle install` and CocoaPods dependency installation;
- a clean iOS simulator build; and
- the final bundle identifier `com.jujistu.app`.

The generated template remains the source of truth for the exact iOS deployment
target and native dependency versions.

## Validation status

- Android toolchain: Ready for project generation.
- Android emulator definition: `Pixel_8_Pro` booted successfully and ran the app.
- React Native Doctor: Node, npm, JDK, Android Studio, `ANDROID_HOME`, and Gradle
  passed. Doctor did not recognize the new `platforms/android-37.0` package naming,
  but the Gradle build compiled successfully with SDK 37 and Build Tools 37.0.0.
- iOS toolchain: Pending validation on macOS.

The Android build is the authoritative validation for this SDK schema. Re-run Doctor
after CLI updates to determine when its SDK detection supports the new package name.
