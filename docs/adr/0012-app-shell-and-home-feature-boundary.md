# ADR 0012: Separate bottom-navigation ownership from Home content

- Status: Accepted
- Date: 2026-09-19
- Supersedes: ADR 0011

## Context

ADR 0011 moved the authenticated Home route shell, account header, and bottom-tab
configuration into `src/features/home`. That grouped code by the first visible route,
but it gave the Home feature ownership of navigation shared by every authenticated
destination.

The bottom-navigation item registry and icon mapping describe application-level
destinations. The Home background, account header, readiness state, and content are
parts of the Home experience and should remain independently owned by the Home
feature.

## Decision

- `src/app/navigation` owns `bottom-navigation-items.ts` and
  `tab-icon-assets.ts` alongside route contracts and navigators.
- `MainNavigator.tsx` composes the active feature screen with the app-owned bottom
  navigation and its bottom safe-area inset.
- `src/app` does not introduce a parallel `screens/` folder for feature screens.
- `src/features/home` owns the complete Home screen: background, top safe area,
  account header, screen sections, data, readiness coordination, and feature hooks.
- `ProductAccountHeader` lives in `src/features/home/sections` because it is a
  visible region of the current Home design, not global application chrome.
- Large screen regions live in `sections/`; `components/` is not used as a generic
  catch-all folder.
- `src/features/home/index.ts` exports the `HomeScreen` feature API consumed by the
  main navigator.

## Consequences

- Bottom navigation can grow to additional destinations without being coupled to
  the Home feature.
- The dependency direction remains `app -> features -> ui -> shared`; Home never
  imports application navigation or the bottom-destination registry.
- Home composition tests import the Home feature; navigation tests cover the
  app-owned bottom-destination configuration separately.
- Moving a new destination into the bottom bar changes app navigation composition,
  not the Home feature.
