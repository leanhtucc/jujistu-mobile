# ADR-0005: UI Design System Layer

- Status: Accepted
- Date: 2026-09-15
- Owners: JUJISTU mobile team

## Context

Reusable product components were previously stored under `src/shared/components`.
That made `shared` responsible for both product UI and product-agnostic
infrastructure, and it left no explicit composition model for a growing design
system.

## Decision

Introduce `src/ui` as the owner of reusable product UI. Its dependency direction is
`app -> features -> ui -> shared`, with `app` also allowed to import `ui` and
`shared` directly.

The UI layer uses Atomic Design category boundaries:

- `atoms` for the smallest reusable primitives;
- `molecules` for small compositions of atoms;
- `organisms` for larger reusable UI sections;
- `templates` for reusable screen-level layouts; and
- `utils` for helpers that are meaningful only inside the UI layer.

Consumers import UI components from the root `@jujistu/ui` public API. Internal
registries and visual recipe helpers are not exported from that API. `shared` owns
non-visual infrastructure and design tokens and may not import `ui`.

The existing `Icon` and `Button` primitives move to `ui/atoms` and become
`AppIcon` and `AppButton`. Their visual and behavioral contracts remain unchanged.
No compatibility exports remain under `src/shared/components`.

TypeScript, Metro, Jest, and the architecture checker resolve the UI alias. The
architecture checker rejects imports from `shared` to `ui`, and from `ui` to
`features` or `app`, including relative imports.

## Consequences

- Reusable product UI has one owner and one public API.
- Feature and application code can consume design-system primitives without making
  `shared` responsible for presentation components.
- Existing imports must migrate to `@jujistu/ui`; the old shared component paths
  intentionally fail instead of being kept as compatibility shims.
- Empty Atomic Design categories can expose an empty barrel until they acquire a
  real component, without adding placeholder components.
