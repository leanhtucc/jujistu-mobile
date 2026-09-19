# ADR 0011: Keep Home implementation inside the Home feature

- Status: Superseded by ADR 0012
- Date: 2026-09-18

## Context

The Home route screen, product account header, bottom-navigation item configuration,
and tab-icon mapping were stored under `src/app`. They are only used by the Home
experience and caused the application-composition layer to own feature UI and
product configuration.

## Decision

Home-owned screens, components, and navigation presentation data live under
`src/features/home` and are exported through its public `index.ts` API.

`src/app` retains only application-wide composition responsibilities: root/auth/main
navigators, route contracts, providers, bootstrap, and startup fallback. Therefore
`MainNavigator` imports `HomeRouteScreen` from `@jujistu/features/home` rather than
reaching into an app-owned screen directory.

The Home route accepts the minimal user display shape it needs instead of importing
the Auth feature's `UserProfile`, preserving the rule that one feature must not
depend on another feature.

## Consequences

- Home implementation can evolve without growing the app composition layer.
- Tests import Home behavior through the feature public API.
- App-level route names and navigator types remain centralized because they compose
  multiple feature branches.

## Supersession

ADR 0012 narrows Home ownership to Home content. The authenticated route shell,
background, account header, and content remain inside the Home feature. Only the
application-wide bottom-navigation configuration lives under `src/app/navigation`.
