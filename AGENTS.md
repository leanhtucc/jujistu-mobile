# JUJISTU Agent Instructions

## Purpose

This file gives coding agents repository-specific working rules. Canonical product
and architecture decisions remain in `docs/`, `CONTRIBUTING.md`, and accepted ADRs.
Do not copy unrelated rules from another product into this repository.

## Required reading

Before modifying this repository, read:

1. `README.md`
2. `CONTRIBUTING.md`
3. `docs/adr/0001-project-foundation.md`
4. `docs/architecture.md`
5. `docs/navigation.md` when changing routes, navigators, or the bottom bar
6. `docs/design-system.md` when changing UI or design tokens
7. every ADR relevant to the requested change

When accepted ADRs and the current implementation disagree, do not silently choose
one. Identify the mismatch and update the decision record as part of an authorized
architecture migration.

## Current source structure

```text
src/
  app/
    bootstrap/       application startup
    navigation/      root navigators, route contracts, bottom destinations
    providers/       application providers and infrastructure bridges
    App.tsx           root composition

  features/
    auth/             authentication UI, hooks, services, and feature types
    home/             Home screen, sections, data, and feature hooks

  ui/
    atoms/            reusable visual primitives
    molecules/        reusable small compositions
    organisms/        reusable larger UI sections and shells
    templates/        reusable screen layouts
    utils/            UI-only helpers

  shared/
    config/           typed runtime configuration
    constants/        shared non-visual constants
    errors/           application error types
    logger/           redacted logging
    services/         product-agnostic infrastructure
    theme/            design tokens and semantic theme values
```

Folders in this map describe ownership, not a requirement to create empty
directories. Add a folder only when it has a current responsibility.

## Ownership rules

- Do not create `src/screens` or `src/app/screens`. Screens belong to the feature
  that owns the user capability, for example `src/features/home/screens`.
- `src/app` is application composition only: startup, providers, navigation, route
  contracts, and application-wide shell configuration. It must not contain a copy
  of a feature screen or feature-only header/content.
- The root bottom-navigation destination registry and tab composition belong in
  `src/app/navigation`. Reusable bottom-navigation visuals belong in `src/ui`.
- Home-only headers and Home content belong in `src/features/home`, not `src/app`.
  Promote a header to `src/ui` only after it has a genuinely reusable product API.
- Do not use `components/` as a catch-all. Use `screens/` for route entry screens,
  `sections/` for substantial screen regions, `hooks/` for feature behavior,
  `services/` for external adapters, `data/` for feature-owned static data, and
  `types/` for feature contracts when those responsibilities exist.
- Generic reusable UI belongs in `src/ui`. Feature-specific UI remains in its
  feature even when it visually resembles another feature's component.
- Reusable non-visual infrastructure belongs in `src/shared`. Code used by one
  feature remains in that feature until real reuse exists.
- Split files by cohesive responsibility, not by an arbitrary line count. A large
  screen should orchestrate feature sections instead of containing unrelated UI,
  remote-state, transformation, and transport logic in one file.

## Import boundaries

- `src/app` may import feature public APIs, `src/ui`, and `src/shared`.
- Cross-layer app imports from a feature must use `@jujistu/features/<feature>` and
  that feature's `index.ts`; app code must not deep-import feature internals.
- A feature may import only its own files, `src/ui`, and `src/shared`.
- One feature must not import another feature directly.
- `src/ui` may import `src/shared`, but never `src/app` or `src/features`.
- `src/shared` must not import `src/app`, `src/features`, or `src/ui`.
- Use the configured `@jujistu/*` aliases across layer boundaries. Relative imports
  are appropriate within a small module inside one layer.

## API and server-state boundary

For new or modified remote operations, the required UI data flow is:

```text
Screen or feature component
  -> feature hook
  -> feature service
  -> shared HTTP transport
  -> backend
```

- Screens and visual components call feature hooks only. They must not import or
  call `fetch`, `apiRequest`, `apiClient`, an `*.api` module, a feature service,
  query keys, `queryFn`, or `mutationFn` directly.
- Feature hooks live in `src/features/<feature>/hooks`. They own TanStack Query,
  cache keys, invalidation, optimistic updates, request lifecycle, and the stable
  UI-facing result or action contract.
- Do not expose raw feature services or query keys from a feature's public
  `index.ts`. Export only the hooks, screens, types, and deliberately narrow
  app-integration hook contracts that external consumers actually need.
- Feature services live in `src/features/<feature>/services`. They are plain async
  TypeScript functions responsible for endpoint calls, request serialization,
  boundary validation, and conversion from API DTOs to feature/domain models.
- Wire-format DTOs are private feature details unless they are genuinely common
  transport envelopes. UI code must not depend on snake_case API response shapes.
- TanStack Query remains the server-state engine. "Hooks only" means it is hidden
  behind feature hooks at the UI boundary; it does not mean duplicating server data
  into local state or removing Query.
- Hooks follow React's Rules of Hooks and cannot be called from HTTP interceptors,
  plain services, bootstrap functions, or event callbacks outside React render.
  App providers may connect infrastructure to a deliberately narrow feature
  runtime contract or inject a callback for token refresh.
- Use one shared HTTP transport. Do not add another fetch wrapper. Treat
  `src/shared/services/api/http-client.ts` and `apiRequest` as the intended transport
  while the legacy duplicate client is being migrated under an approved plan.
- Keep business endpoints and normalization out of the shared transport. Shared
  API code owns generic request concerns only: base URL, headers, serialization,
  timeout/cancellation, safe logging, normalized errors, activity tracking, and a
  single bounded 401 retry.
- Store tokens only through `tokenManager`. Never store credentials in TanStack
  Query, navigation params, AsyncStorage, logs, screenshots, or UI state.
- Preserve single-flight refresh behavior. Refresh requests must skip the normal
  unauthorized handler, and a failed refresh must clear the local session without
  creating a retry loop.
- Do not add fixed delays to auth hydration or API orchestration. Startup follows
  the readiness signals defined in ADR-0009.

## UI and responsive rules

- Before creating a reusable UI component, inspect `docs/design-system.md`,
  `src/ui`, and the existing semantic theme tokens.
- Reuse or extend an existing `src/ui` component when its semantics match. Do not
  create a feature-local duplicate for small color, spacing, radius, or icon
  differences.
- Keep feature business UI in the feature; promote it only when the API is stable
  and at least one real cross-feature reuse exists.
- Use semantic theme values instead of introducing raw colors in runtime UI.
- Responsive changes must preserve phone behavior. Use the helpers in
  `src/shared/constants/responsive.ts`, flexible layout, safe areas, and scroll/keyboard-safe
  containers instead of screen-specific absolute offsets.
- If a shared UI public API or theme token changes, update the related documentation
  and tests in the same change.

## Assets and configuration

- Global or cross-feature assets belong in the repository `assets/` tree. Assets
  used by one feature remain owned by that feature when practical.
- Do not hardcode API URLs, secrets, credentials, signing values, or private keys in
  source. Mobile environment configuration is not a secret; actual credentials are.
- Preserve the React Native 0.87.1 native template unless a dedicated upgrade is
  explicitly requested.
- Use npm only. Never create another package-manager lockfile.
- Do not add dependencies, change native build tools, or edit signing configuration
  without a concrete requirement and appropriate validation.

## Change discipline and validation

- Inspect existing code and native configuration before editing.
- Make the smallest coherent change that satisfies the request. Preserve unrelated
  work already present in a dirty worktree.
- Do not introduce empty folders, speculative layers, or compatibility wrappers
  without a real current caller and a removal plan.
- Update or add an ADR when an accepted architecture decision changes. Important
  decisions must not exist only in chat, prompts, or `AGENTS.md`.
- Add tests at the owning boundary: transport behavior, service normalization,
  hook/cache behavior, and screen interaction should not be mixed into one test.
- Run `npm run verify` after relevant source, test, configuration, or instruction
  changes. Run a debug Android build only when Android or native behavior changes.
  iOS validation requires a real macOS build.
- Never claim Android or iOS validation unless that corresponding build actually
  ran successfully.
- Report pre-existing failures separately from failures caused by the current
  change; do not hide, reset, or overwrite unrelated user changes.
