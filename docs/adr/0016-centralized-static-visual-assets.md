# ADR 0016: Centralize runtime visual assets

- Status: Accepted
- Date: 2026-09-28
- Owners: JUJISTU mobile team
- Supersedes: The feature-local asset allowance in the repository instructions

## Context

Runtime images and icon copies had started to appear under feature folders next to
screens and components. This made the same visual source discoverable from multiple
locations and allowed PNG icon copies to bypass the verified SVG glyph pipeline.

## Decision

- Store all runtime static visual files in the repository-root `assets/` tree.
- Do not create `assets/` folders under `src`, including inside features, screens,
  or components.
- Store canonical icon sources under `assets/icons/<category>/` as SVG only.
- Consume icons through `AppIcon` and its verified generated glyph registry. The
  generated TSX glyph files under `src/ui/atoms/icon/glyphs/` are build output, not
  a second canonical asset source.
- Store non-icon imagery under the appropriate `assets/image/` category and keep
  application branding under `assets/app/`.
- Enforce both the root asset boundary and SVG-only icon rule in the architecture
  checker.

## Consequences

- Home quick actions use the existing `assets/icons/home` SVG sources through
  `AppIcon`; their feature-local PNG copies are removed.
- Home event artwork and video thumbnails move to root image categories.
- Screens remain orchestration code and never become asset containers.
- Adding a non-SVG visual below `src` or a PNG/JPG inside `assets/icons` fails
  `npm run architecture:check`.
