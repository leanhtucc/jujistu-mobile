# Contributing to JUJISTU

## Before starting

1. Read `README.md`, `docs/adr/0001-project-foundation.md`, and any ADR related to
   the area being changed.
2. Install dependencies with `npm ci`.
3. Confirm the existing tests and checks pass.
4. Define the requirement and acceptance criteria before implementation.

## Branch and pull request rules

- Do not push directly to the protected main branch.
- Use a short-lived branch with a clear `feat/`, `fix/`, `chore/`, or `docs/`
  prefix.
- Keep each pull request focused on one outcome.
- Avoid unrelated cleanup or refactoring.
- Rebase or update the branch with main before final approval.
- Use squash merge after all required checks and reviews pass.

## Dependency changes

- npm is the only package manager.
- Commit `package-lock.json` whenever dependencies change.
- Do not edit the lockfile by hand.
- Add or upgrade a dependency in a dedicated pull request when practical.
- Explain why the dependency is needed and verify its React Native 0.87 and New
  Architecture compatibility.
- A dependency change is incomplete until Android and iOS native builds pass.

## Native changes

- Changes under `android/` or `ios/` require a native-aware reviewer.
- Do not upgrade Gradle, AGP, Kotlin, Xcode settings, CocoaPods, or deployment targets
  as part of a feature pull request.
- Never commit release keys, certificates, provisioning profiles, passwords, tokens,
  or private environment files.
- Generated build folders and CocoaPods must remain untracked.

## Architecture rules

- The intended dependency direction is `app -> features -> shared` and
  `app -> shared`.
- Screens do not call HTTP APIs directly.
- Feature-specific code remains inside the owning feature.
- Shared code must not import application or feature modules.
- Do not create empty folders or abstractions without a current responsibility.

These boundaries will be automated when the application source architecture is
introduced. Until then, reviewers must reject violations.

## Required checks

Before opening or updating a pull request, run:

```sh
npm run verify
```

Changes affecting Android must also pass a debug Android build. Changes affecting
iOS or native dependencies must pass a clean iOS simulator build on macOS.

## Definition of done

A change is done only when:

- acceptance criteria are met;
- types, formatting, lint, and tests pass;
- relevant error, loading, empty, and accessibility states are covered;
- no secret or sensitive value is logged or committed;
- native builds pass when affected; and
- documentation and ADRs are updated when behavior or architecture changes.
