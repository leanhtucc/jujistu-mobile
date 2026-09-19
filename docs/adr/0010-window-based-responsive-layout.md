# ADR 0010: Use window-based responsive layout classes

- Status: Accepted
- Date: 2026-09-18

## Context

JUJISTU must support small and large Android phones, iPhones, Android tablets,
iPads, portrait and landscape orientations. Device-model checks are unreliable:
the same device can expose different usable sizes under split-screen, Stage Manager,
Display Zoom, font scaling, system bars, foldable states, or Android display-size
settings.

## Decision

Responsive decisions use the current React Native window from
`useWindowDimensions`. The shared `responsive.ts` module derives five size classes:
compact phone, phone, large phone, tablet, and large tablet. Classification uses the
shortest and longest logical sides, so rotating a full-screen device retains its
size class while orientation remains available as a separate value.

Components select explicit values per size class. Missing larger-class values fall
back through the smaller-class values. Proportional scaling is clamped to avoid tiny
controls on narrow phones or oversized controls on tablets. Accessibility font scale
is never divided out.

Screen content is width-capped and centered on tablets and landscape windows rather
than stretching phone layouts edge to edge.

## Consequences

- Layout code responds to the available window instead of platform or model names.
- Split-screen tablet windows may intentionally receive a phone layout when their
  usable width becomes phone-sized.
- Breakpoint changes require updating the shared tests covering representative
  Android, iOS, tablet, and iPad dimensions.
- Safe-area insets remain the responsibility of screen composition and are not
  replaced by responsive metrics.
