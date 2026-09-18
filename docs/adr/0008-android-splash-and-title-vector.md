# 8. Android 12+ Splash Safe Margins and Jujitsu Championship Vector Title

Date: 2026-09-17

## Status

Accepted

## Context

1. **Android 12+ (API 31+) SplashScreen Masking**: The splash screen icon was rendered zoomed in with parts of the circular badge and the text "Jujitsu" cropped off on devices running Android 12+. Under the Android 12+ SplashScreen API (`android:windowSplashScreenAnimatedIcon`), the system encloses the icon in a 160dp diameter circular/squircle mask inside a 288dp canvas (~55.5% diameter ratio). Because `splash_logo.png` filled 94.4% of the canvas with zero safe padding, the system mask cut off the outer edges. Additionally, `windowSplashScreenIconBackgroundColor` caused an explicit squircle background card to appear behind the icon.

2. **Login Screen Title Fidelity**: The Figma design used a specialized metallic chrome gradient display title ("JUJITSU CHAMPIONSHIP"). Standard `SvgText` with system or custom font rendering suffered from platform rendering inconsistencies and stroke clumping.

## Decision

1. **Splash Screen Safe Padding**:

   - Re-generated `splash_logo.png` assets across all density buckets (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) placing the logo inside the ~55% safe area with transparent margins.
   - Set `android:windowSplashScreenIconBackgroundColor` to `@android:color/transparent` in `values-v31/styles.xml` so the logo sits cleanly on `@color/splash_background` without an artificial background card.
   - Set `launch_screen.xml` layer dimensions to 260dp so that on older Android versions (< API 31), the logo renders at the intended ~144dp visual footprint.

2. **Vector-Based Title Component**:
   - Implemented [`JujitsuChampionshipTitle`](../../src/ui/atoms/jujitsu-championship-title.tsx) using vector outlines matching the Esport Woglen typeface.
   - Wired [`JujitsuChampionshipTitle`](../../src/ui/atoms/jujitsu-championship-title.tsx) into [`AuthHero`](../../src/features/auth/components/AuthHero.tsx).
