# Navigation

JUJISTU uses React Navigation 7 with the native stack navigator. The stable major
version is intentional; React Navigation 8 is still pre-release and must not be
introduced without a dedicated upgrade review.

## Current structure

```text
src/app/navigation/
├── AuthNavigator.tsx        stack navigator for unauthenticated email OTP flows
├── bottom-navigation-items.ts application-wide authenticated destinations
├── MainNavigator.tsx        stack navigator for authenticated flows (Home)
├── NavigationFallback.tsx   accessible loading state during session resolution
├── RootNavigator.tsx        root container conditionally rendering Auth or Main
├── routes.ts                centralized ROOT_ROUTES, AUTH_ROUTES, MAIN_ROUTES constants
├── tab-icon-assets.ts       active/inactive icon mapping for bottom destinations
└── types.ts                 typed RootStackParamList, AuthStackParamList, MainStackParamList
```

## Navigation flow

The application root determines navigation branch reactively based on authentication
state (`useAuthState`):

```text
RootNavigator (NavigationContainer)
├── [unauthenticated] AuthNavigator (Stack)
│   ├── Welcome
│   ├── Login
│   └── Otp (transparent modal)
│
└── [authenticated] MainNavigator (Stack)
    └── Main navigation content
        ├── HomeScreen (complete Home feature)
        └── AppBottomNavigation (application navigation)
```

## Rules

- Route names come from `ROOT_ROUTES`, `AUTH_ROUTES`, or `MAIN_ROUTES`; do not repeat
  string literals in screens.
- Every route and its parameters must be represented in its corresponding param list.
- Application composition owns navigators and the application-wide bottom-destination
  registry. Feature screens—including their feature-specific headers and content—are
  exported through their public `index.ts` API.
- Business logic must not import navigation objects.
- Pass serializable identifiers through route parameters, not full domain objects,
  callbacks, credentials, or tokens.
- Do not suppress unhandled navigation actions globally.
- Add deep-link prefixes and catch-all behavior only after the public URL/scheme
  contract and security review are complete.

`RootNavigator` also coordinates startup readiness as documented in ADR 0009. Its
`NavigationFallback` remains mounted above the destination until session restore,
the navigation container, loading assets, the destination's critical background, and
the minimum visible duration (4000ms from visible presentation) are ready. The
fallback progress bar animates from 0% to 100% over the minimum visible duration;
do not add fixed startup delays or fake percentage progress in business or data layers.

The authentication background wraps the entire `AuthNavigator`, so it persists
across Welcome, Login, and OTP. Login is not pre-mounted during startup. All startup
and auth surfaces must retain an explicit black fallback independent of the system
theme.

## Native setup

Android configures `RNScreensFragmentFactory` before `ReactActivity.onCreate`, as
required by `react-native-screens`, to avoid restoration-related crashes. iOS uses
CocoaPods autolinking; run `bundle exec pod install` on macOS after a clean install
or native dependency change.

Any new navigator or navigation dependency requires Android and iOS native builds.
