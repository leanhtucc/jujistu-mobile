# JUJISTU

JUJISTU is a React Native CLI application for Android and iOS.

## Baseline

- React Native `0.87.1`
- React `19.2.3`
- Node.js `22.16.0`
- npm `10.9.2`
- JDK 17
- Android application ID `com.jujistu.app`
- iOS bundle identifier `com.jujistu.app`

Read [the environment baseline](docs/environment-baseline.md) before the first
local setup. Architecture decisions are recorded in [docs/adr](docs/adr).

## Install

Use npm only. From a clean clone:

```sh
npm ci
```

Do not use `npm install` for ordinary CI or onboarding installs, and do not create a
Yarn or pnpm lockfile.

## Android

Start an Android emulator or connect a physical device, then use two terminals:

```sh
npm start
```

```sh
npm run android
```

The Android build requires JDK 17 and Android SDK/Build Tools 37.

## iOS

A Mac with Xcode is required. Install native dependencies before the first build and
after native dependency changes:

```sh
bundle install
cd ios
bundle exec pod install
cd ..
npm run ios
```

## Quality checks

Run the complete local gate before opening a pull request:

```sh
npm run verify
```

Individual commands are also available:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test:ci
```

Android and iOS native builds are additional required checks and will be enforced by
GitHub Actions. The workflow runs `Quality`, `Android debug build`, and
`iOS simulator build` for pull requests and pushes to `main`.

The iOS pipeline currently resolves gems from `Gemfile`. Generate and commit a
verified `Gemfile.lock` from macOS before dependency versions are changed or the
project is released.

## Contribution workflow

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing code. Project-generation and
initial validation details are in
[docs/scaffold-validation.md](docs/scaffold-validation.md).

After pushing the repository to GitHub, apply
[the branch protection checklist](docs/branch-protection.md).
