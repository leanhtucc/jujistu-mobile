# ADR-0004: SVG-to-TSX Glyph Asset Pipeline via @svgr/cli

- Status: Accepted (Supersedes runtime transformer approach)
- Date: 2026-09-15
- Owners: JUJISTU mobile team

## Context

Phase 3 and Phase 6 established the frozen `AppIcon` architecture in `src/ui/atoms/icon/` using an immutable static registry of typed React Native TSX glyphs (`GlyphProps`). To scale icon intake from Figma without runtime bundler overhead or geometry corruption, an automated build-time pipeline is required.

An initial proposal evaluated runtime `react-native-svg-transformer` with `declare module '*.svg'`. This approach was rejected because:

1. It bypasses the immutable static `IconName` registry contract.
2. It introduces Metro configuration overrides and bundler complexity.
3. It risks unmonitored runtime SVG rendering without color normalization or accessibility auditing.

## Decisions

### 1. Build Pipeline: @svgr/cli

- Add `@svgr/cli` as a development dependency.
- Reject `react-native-svg-transformer`. Keep Metro (`metro.config.js`) completely free of SVG-specific configuration.
- Do NOT add `declare module '*.svg'`. Raw SVG files are build-time source assets only, never imported at runtime.

### 2. Geometry Integrity: SVGO Disabled

- SVGO is strictly disabled (`--no-svgo`) to ensure exact Figma vector geometry (paths, viewBox, curves) remains auditable and unmodified.

### 3. Asset Structure & Generator

- Canonical raw SVG source root is `assets/icons/` with subfolders `common/`, `home/`, and `tabs/`.
- The generator script `scripts/generate-icons.js` (invoked via `npm run icons:generate`):
  - Traverses `assets/icons/` recursively.
  - Preserves relative subfolder structure into `src/ui/atoms/icon/glyphs/` (e.g. `glyphs/tabs/ic_shop.tsx`).
  - Enforces collision safety: protected verified glyphs (`ChevronLeftGlyph.tsx`, `LogOutGlyph.tsx`) cannot be overwritten.
  - Normalizes monochrome glyphs by mapping single foreground colors to the `color` prop without altering path data.
  - Flags multicolor graphics as `[MULTICOLOR_REVIEW_REQUIRED]` and preserves original palette.
  - Adapts generated components strictly to the `GlyphProps` contract (`size: number; color: string;`).

### 4. Manual Immutable Registry

- Generated TSX files are not automatically registered into runtime `glyphs.ts`.
- Each glyph must undergo developer code review before being manually added to the immutable `glyphs` object.
- `IconName` remains statically derived from `keyof typeof glyphs`.

## Consequences

- **Positive**: Build-time compilation ensures zero runtime SVG parsing overhead and 100% type safety.
- **Positive**: Figma vector paths are preserved with zero decimation or loss of fidelity.
- **Positive**: Preserves existing `AppIcon` architecture and public API without breaking changes.
- **Negative**: Adds manual step of reviewing and registering glyphs into `glyphs.ts`.
