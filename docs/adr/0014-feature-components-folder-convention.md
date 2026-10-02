# ADR 0014: Use components for feature-owned visual regions

- Status: Accepted
- Date: 2026-09-28
- Owners: JUJISTU mobile team
- Supersedes: The Home folder-location clauses in ADR 0012

## Context

Home visual regions were placed under `src/features/home/sections`, while the team
uses `components` as the established and more discoverable name for feature-owned
visual building blocks. Keeping both names would create parallel categories whose
ownership differs only by subjective component size.

## Decision

- Feature route entry points live in `screens/`.
- Feature-owned visual building blocks, including substantial regions composed by a
  screen, live in `components/`.
- Features do not create a parallel `sections/` folder.
- Components remain split by cohesive responsibility; `components/` is not a reason
  to combine unrelated UI, remote state, transformations, or transport concerns.
- Reusable product UI still belongs in `src/ui` after genuine cross-feature reuse.
- Home account headers, hero carousel, quick actions, event ticket, featured video,
  and news regions therefore live in `src/features/home/components/`.

## Consequences

- Feature visual code uses one predictable folder convention.
- Screens orchestrate named feature components while retaining ownership of safe
  areas, scrolling, and route-level composition.
- ADR 0012 continues to govern Home versus application-shell ownership; only its
  `sections/` folder convention is superseded.
