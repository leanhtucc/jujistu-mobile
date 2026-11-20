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

## Commit messages

Format: `type(scope): subject`, enforced by commitlint (`commit-msg` hook and
local `.gitmessage` template).

- `type`: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `ci`, `build`,
  `revert`.
- `scope`: the owning area in kebab-case, for example `auth`, `missions`, `shop`,
  `ui`, `shared`, `navigation`, `deps`. Several scopes: `feat(auth,missions): ...`.
- Subject: imperative, about 72 characters, no trailing period.
- Body (when useful): explain why the change was needed and what it affects, not a
  recap of the diff.
- One commit, one logical change. A `feat` or `fix` commit includes its tests.

The `pre-commit` hook runs `lint-staged` (eslint + prettier on staged files). Do not
bypass hooks with `--no-verify`.

## Code comments

Comments exist so a new reader can follow the logic flow without asking the author.
Use three levels, each with one purpose:

1. **File header** (screens, hooks, services, and any non-trivial module): what the
   file does, where it sits in the flow, and what it deliberately does not do.

   ```ts
   /**
    * Login flow, hook layer.
    * Flow: LoginScreen -> useLogin (this file) -> auth-service.login -> apiRequest.
    * Responsibility: persist tokens via tokenManager and seed the currentUser cache.
    * Not here: HTTP calls (service) and error display (screen).
    */
   ```

2. **JSDoc on exports** (hooks, services, public components, shared utilities):
   purpose, notable params, return value, and side effects (tokens saved, cache
   invalidated, navigation triggered). ESLint (`jsdoc/require-jsdoc`) warns when an
   exported function in those folders has none.

3. **Inline comments** explain _why_, never _what_: workarounds, ordering
   constraints, legal requirements, magic numbers, links to the ADR. Mark the main
   steps of a long function with `// FLOW: <step>` so it reads as an outline.

Rules:

- Do not restate code, leave commented-out code, or comment obvious JSX.
- `TODO(owner): message (issue)` and `FIXME(owner): message`; never an anonymous TODO.
- Comments are written in English, like the code and docs.
- Update the comment in the same change that alters the behavior it describes.

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

These boundaries are enforced by `npm run architecture:check`. Reviewers must still
check semantic violations that static analysis cannot identify.

## Required checks

Before opening or updating a pull request, run:

```sh
npm run verify
```

Changes affecting Android must also pass a debug Android build. Changes affecting
iOS or native dependencies must pass a clean iOS simulator build on macOS.

Every pull request must pass these GitHub Actions checks before merge:

- `Quality`
- `Android debug build`
- `iOS simulator build`
- `Commit messages`

If a check is skipped because its prerequisite failed, fix the first failure and
rerun the workflow. Do not merge by bypassing a required check.

## Definition of done

A change is done only when:

- acceptance criteria are met;
- types, formatting, lint, and tests pass;
- relevant error, loading, empty, and accessibility states are covered;
- no secret or sensitive value is logged or committed;
- native builds pass when affected; and
- documentation and ADRs are updated when behavior or architecture changes.
