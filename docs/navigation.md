# Navigation

JUJISTU uses React Navigation 7 with the native stack navigator. The stable major
version is intentional; React Navigation 8 is still pre-release and must not be
introduced without a dedicated upgrade review.

## Current structure

```text
src/app/navigation/
├── NavigationFallback.tsx
├── RootNavigator.tsx
├── routes.ts
└── types.ts
```

Only the existing `Home` route is registered. Authentication, tabs, deep links,
notification navigation, and an imperative navigation ref are deferred until their
flows and ownership are defined.

## Rules

- Route names come from `ROOT_ROUTES`; do not repeat string literals in screens.
- Every route and its parameters must be represented in `RootStackParamList`.
- Application composition owns navigators; features export screens through their
  public `index.ts` API.
- Business logic must not import navigation objects.
- Pass serializable identifiers through route parameters, not full domain objects,
  callbacks, credentials, or tokens.
- Do not suppress unhandled navigation actions globally.
- Add deep-link prefixes and catch-all behavior only after the public URL/scheme
  contract and security review are complete.

`NavigationFallback` is an accessible loading state used while the navigation
container resolves initial state. It is not an error screen and must not hide
invalid route definitions.

## Native setup

Android configures `RNScreensFragmentFactory` before `ReactActivity.onCreate`, as
required by `react-native-screens`, to avoid restoration-related crashes. iOS uses
CocoaPods autolinking; run `bundle exec pod install` on macOS after a clean install
or native dependency change.

Any new navigator or navigation dependency requires Android and iOS native builds.
