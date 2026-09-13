# ADR-0001: JUJISTU Project Foundation

- Status: Accepted
- Date: 2026-09-13
- Owners: JUJISTU mobile team

## Context

JUJISTU will be a React Native CLI application maintained by multiple developers.
The foundation must keep local environments reproducible, make module ownership
clear, and prevent invalid changes from being merged through automated checks.

This record must be accepted before generating the Android and iOS projects.

## Decisions already agreed

### Product identity

- Repository directory: `jujistu-app`
- Product display name: `JUJISTU`
- React Native project name: `JUJISTU`
- Android application ID: `com.jujistu.app`
- iOS bundle identifier: `com.jujistu.app`
- Identifier namespace: `com.jujistu`
- Target platforms: Android and iOS

### Runtime and native toolchain

- React Native: `0.87.1` (exact version)
- React Native Community CLI; no Expo framework
- TypeScript with strict checking
- React Native New Architecture
- Node.js: `22.16.0` for the initial baseline
- Java: JDK 17
- Android compile SDK/build tools: version 37, as required by React Native 0.87
- iOS builds must be verified on macOS with Xcode

The generated React Native template is the source of truth for compatible Gradle,
Android Gradle Plugin, Kotlin, Ruby, CocoaPods, and iOS deployment settings. These
versions must not be manually upgraded during project creation.

### Dependency management

- Use npm only.
- Commit `package-lock.json`.
- CI and clean local installs use `npm ci`.
- Do not add application libraries to the first generated-template commit.
- Dependency additions and upgrades must be isolated and justified in a pull request.

### Architecture

- Use feature-based architecture with lightweight clean boundaries.
- Dependency direction: `app -> features -> shared` and `app -> shared`.
- `shared` must never import from `features` or `app`.
- Screens must not call HTTP APIs directly.
- Feature code stays inside its owning feature unless it is genuinely reused.
- Do not create empty folders or speculative abstractions.
- Automated lint rules and CI, rather than documentation alone, will enforce the
  important boundaries.

### State ownership

- React local state for component-local UI state.
- TanStack Query for remote/server state when API integration begins.
- Redux Toolkit is deferred until a concrete global client-state requirement exists.
- Server data must not be copied into Redux without an explicit architectural reason.

### Data and security

- Start with the platform `fetch` API behind one typed shared HTTP client.
- Validate data at external boundaries before business code consumes it.
- Store non-sensitive persisted values separately from credentials.
- Tokens and credentials must use Keychain/Keystore-backed secure storage.
- Environment configuration embedded in a mobile build is not considered secret.
- Passwords, tokens, private keys, and personal data must not be logged.

### Quality and collaboration

- No direct pushes to the protected main branch.
- Every change is reviewed through a focused pull request.
- Required checks: formatting, lint, TypeScript, tests, Android build, and iOS build.
- Native configuration, authentication, CI, and dependency files require owner review.
- Canonical human-readable rules live in `docs/` and `CONTRIBUTING.md`.
- `AGENTS.md` and optional `CLAUDE.md` will point to the canonical documents instead
  of duplicating the complete rules.

## Project-generation identity

The native project must be generated with these final values:

- Android application ID: `com.jujistu.app`
- iOS bundle identifier: `com.jujistu.app`
- React Native project name: `JUJISTU`
- App display name: `JUJISTU`
- Repository directory: `jujistu-app`

These identifiers must remain stable after native integrations, signing, deep links,
or store records are introduced. Any future change requires a separate ADR and a
native migration plan.

## Decisions required before core infrastructure

These do not block generating and building the blank application:

- Backend ownership and API base URLs for development, staging, and production.
- Authentication method and token/session contract.
- Whether development, staging, and production use distinct package identifiers.
- Initial navigation map and authenticated/guest flows.
- Vietnamese-only or Vietnamese-and-English localization at launch.
- Offline behavior requirements.
- Source hosting and CI provider.

## Decisions required before release

- Minimum supported Android and iOS versions, if different from template defaults.
- Apple Developer and Google Play Console ownership.
- Signing-key ownership, backup, and CI secret access.
- Push notification provider and credentials.
- Crash reporting, analytics, privacy, and data-retention policy.
- Release approval, versioning, rollback, and incident process.

## Phase 0 exit criteria

Phase 0 is complete when:

- this ADR is reviewed and changed to `Accepted`;
- Android application ID and iOS bundle identifier are final;
- the organization namespace is final; and
- no unresolved item can force the native project to be renamed or regenerated.

After acceptance, the next operation is environment validation and installation of
the Android SDK/build tools required by React Native 0.87. Only then may the blank
React Native project be generated.
